import { STYLE_OPTIONS } from '@/lib/styleOptions'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { uploadRemoteImage } from '@/lib/supabase/storage'
import { NextRequest, NextResponse } from 'next/server'
import { PACKAGES } from '@/types'

function styleWithDescription(style: string): string {
  // const styleMap: Record<string, string> = {
  //   'south_park': 'South Park style',
  //   'disney': 'Disney style',
  //   'pixar': 'Pixar style',
  //   'cartoon': 'Cartoon style',
  //   'anime': 'Anime style',
  //   'comic_book': 'Comic Book style',
  //   'watercolor': 'Watercolor painting style',
  //   'pop_art': 'Pop Art style',
  //   'sketch': 'Sketch style',
  //   'minimalist': 'Minimalist style'
  // }
  const sd = STYLE_OPTIONS.find((s) => s.id === style)
  if (!sd) return style
  return sd.name;//`${sd.name} with ${sd.description}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const serviceSupabase = createServiceRoleClient()
    const { data: { user } } = await supabase.auth.getUser()

    const formData = await request.formData()
    const selectedPackage = (formData.get('package') as string) || 'free'
    const paymentIntentId = formData.get('payment_intent_id') as string | null
    const packageConfig = PACKAGES[selectedPackage as keyof typeof PACKAGES]
    if (!packageConfig) {
      return NextResponse.json(
        { error: 'Invalid package selected.' },
        { status: 400 }
      )
    }

    const ownerImage = formData.get('owner_image') as File
    const petImage = formData.get('pet_image') as File
    const email = formData.get('email') as string
    const isGuest = formData.get('is_guest') === 'true'
    const selectedStylesRaw = formData.get('selected_styles')
    const selectedStyles =
      typeof selectedStylesRaw === 'string'
        ? (() => {
          try {
            const parsed = JSON.parse(selectedStylesRaw)
            return Array.isArray(parsed) ? parsed.map((item) => styleWithDescription(String(item))) : [styleWithDescription(selectedStylesRaw)]
          } catch {
            return [styleWithDescription(selectedStylesRaw)]
          }
        })()
        : []
    const stylesRequested = Math.max(1, selectedStyles.length)
    // Each request currently generates one image per style, so consume quota accordingly
    const imagesRequested = stylesRequested

    let userProfile: { free_generation_used: boolean } | null = null
    if (!isGuest && user?.id) {
      const { data: profile } = await supabase
        .from('petiboo_users')
        .select('free_generation_used')
        .eq('id', user.id)
        .single()
      userProfile = profile || null
    }

    if (!ownerImage || !petImage || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (isGuest) {
      const { data: existingOrders } = await supabase
        .from('petiboo_orders')
        .select('id')
        .eq('user_email', email)
        .eq('is_guest', true)

      if (existingOrders && existingOrders.length > 0) {
        return NextResponse.json(
          { error: 'Free generation already used. Please sign in to create more.' },
          { status: 403 }
        )
      }
    }

    if (!isGuest && selectedPackage === 'free' && userProfile?.free_generation_used) {
      return NextResponse.json(
        { error: 'Free caricature already used. Please purchase a package to continue.', payment_required: true },
        { status: 403 }
      )
    }

    let quotaForPackage: { remaining_images: number; remaining_styles: number } | null = null
    let quota: { remaining_images: number; remaining_styles: number; package: string } | null = null

    let payment: {
      id: string
      status: string
      user_id: string | null
      stripe_payment_intent_id: string | null
      order_id: string | null
      amount: number | null
      currency: string | null
      package: string | null
    } | null = null

    if (selectedPackage !== 'free') {
      if (stylesRequested > packageConfig.max_styles) {
        return NextResponse.json(
          { error: `You can select up to ${packageConfig.max_styles} styles for this package.` },
          { status: 400 }
        )
      }

      if (user?.id) {
        const { data: quotaData } = await supabase
          .from('petiboo_quotas')
          .select('remaining_images, remaining_styles, package')
          .eq('user_id', user.id)
          .single()
        quota = quotaData || null
      }

      const quotaSufficient =
        !!quota &&
        quota.package === selectedPackage &&
        quota.remaining_images >= imagesRequested &&
        quota.remaining_styles >= stylesRequested

      if (!paymentIntentId && !quotaSufficient) {
        return NextResponse.json(
          {
            error: 'Payment required before creating order.',
            payment_required: true,
            package: selectedPackage
          },
          { status: 402 }
        )
      }

      if (paymentIntentId) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('petiboo_payments')
          .select('id, status, user_id, stripe_payment_intent_id, order_id, amount, currency, package')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single()

        if (paymentError || !paymentData || paymentData.status !== 'succeeded') {
          return NextResponse.json(
            { error: 'Payment not found or not completed.', payment_required: true },
            { status: 402 }
          )
        }

        payment = paymentData

        if (payment.user_id && user?.id && payment.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Payment does not belong to this user.' },
            { status: 403 }
          )
        }

        if (payment.order_id) {
          return NextResponse.json(
            { error: 'Payment already used for an order.' },
            { status: 400 }
          )
        }

        if (payment.package && payment.package !== selectedPackage) {
          return NextResponse.json(
            { error: 'Selected package does not match payment package.' },
            { status: 400 }
          )
        }

        if ((!quota || quota.package !== selectedPackage) && user?.id) {
          // Provision quota from paid package if missing or mismatched
          const remainingImages = packageConfig.images_per_style * packageConfig.max_styles
          const { data: newQuota, error: quotaCreateError } = await serviceSupabase
            .from('petiboo_quotas')
            .upsert({
              user_id: user.id,
              package: selectedPackage,
              remaining_images: remainingImages,
              remaining_styles: packageConfig.max_styles,
              images_per_style: packageConfig.images_per_style,
              max_styles: packageConfig.max_styles,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id'
            })
            .select()
            .single()

          if (quotaCreateError) {
            return NextResponse.json(
              { error: 'Unable to provision package quota. Please try again.' },
              { status: 500 }
            )
          }

          quota = newQuota
        }
      }

      if (!quota || quota.package !== selectedPackage) {
        return NextResponse.json(
          { error: 'Package limits exceeded. Please purchase a new package.', payment_required: true },
          { status: 402 }
        )
      }

      if (quota.remaining_images < imagesRequested || quota.remaining_styles < stylesRequested) {
        return NextResponse.json(
          { error: 'Package limits exceeded. Please purchase a new package.', payment_required: true },
          { status: 402 }
        )
      }

      quotaForPackage = {
        remaining_images: quota.remaining_images - imagesRequested,
        remaining_styles: quota.remaining_styles,
      }
    }

    if (isGuest && selectedPackage !== 'free') {
      return NextResponse.json(
        { error: 'Guests cannot purchase packages. Please sign in.' },
        { status: 401 }
      )
    }

    const ownerOptimized = await uploadImage(ownerImage, 'optimized', serviceSupabase)
    const ownerOriginal = await uploadImage(ownerImage, 'original', serviceSupabase)
    const petOptimized = await uploadImage(petImage, 'optimized', serviceSupabase)
    const petOriginal = await uploadImage(petImage, 'original', serviceSupabase)

    const { data: order, error: orderError } = await supabase
      .from('petiboo_orders')
      .insert({
        user_id: user?.id || null,
        user_email: email,
        owner_image_optimized: ownerOptimized,
        owner_image_original: ownerOriginal,
        pet_image_optimized: petOptimized,
        pet_image_original: petOriginal,
        package: selectedPackage || 'free',
        num_images: imagesRequested,
        is_guest: isGuest,
        status: 'pending',
        selected_styles: selectedStyles,
        stripe_payment_id: paymentIntentId || null,
        stripe_payment_status: paymentIntentId ? 'succeeded' : null,
        total_price: paymentIntentId && payment && typeof payment.amount === 'number' ? payment.amount : null,
      })
      .select()
      .single()

    if (!isGuest && selectedPackage === 'free' && user?.id) {
      await supabase
        .from('petiboo_users')
        .update({ free_generation_used: true })
        .eq('id', user.id)
    }

    if (orderError) throw orderError
    if (order?.id && selectedPackage !== 'free' && user?.id && quotaForPackage) {
      await serviceSupabase
        .from('petiboo_quotas')
        .update({
          remaining_images: Math.max(0, quotaForPackage.remaining_images),
          remaining_styles: Math.max(0, quotaForPackage.remaining_styles),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    if (paymentIntentId && order?.id) {
      await serviceSupabase
        .from('petiboo_payments')
        .update({ order_id: order.id })
        .eq('stripe_payment_intent_id', paymentIntentId)
    }


    const n8nWebhookUrl = process.env.NEXT_N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      const callbackUrl = `${request.nextUrl.origin}/api/n8n/callback`
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          image_url1: ownerOriginal,
          image_url2: petOriginal,
          user_email: email,
          is_guest: isGuest,
          selected_styles: selectedStyles,
          callback_url: callbackUrl,
        })
      })

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        console.error('[n8n webhook] failed', n8nResponse.status, errorText)
      } else {



        const n8nData = await n8nResponse.json()

        function inferContentType(url: string): string | null {
          const u = url.toLowerCase();
          if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
          if (u.endsWith('.png')) return 'image/png';
          if (u.endsWith('.webp')) return 'image/webp';
          return null;
        }

        function inferSizeFromResolution(resolution?: string) {
          if (resolution?.toUpperCase() === '2K') return { width: 2048, height: 2048 };
          if (resolution?.toUpperCase() === '1K') return { width: 1024, height: 1024 };
          return { width: null, height: null };
        }


        const firstResult: any = Array.isArray(n8nData) ? n8nData[0] : n8nData
        // const images: any[] = firstResult?.images || []
        const resultImageUrl = firstResult?.data?.response?.resultImageUrl;
        const paramJson = firstResult?.data?.paramJson ? JSON.parse(firstResult?.data?.paramJson) : {};
        const widthHeight = inferSizeFromResolution(paramJson?.resolution);
        const taskId = firstResult?.data?.taskId;
        const prompt = paramJson?.prompt || '';
        const image: any = {
          url: resultImageUrl,
          ...widthHeight,
          content_type: inferContentType(resultImageUrl),
        }
        const images: any[] = image.url ? [image] : [];

        await serviceSupabase
          .from('petiboo_orders')
          .update({ status: 'processing', processing_started_at: new Date().toISOString() })
          .eq('id', order.id)

        await uploadFalAiGeneratedImages(
          {
            order_id: order.id,
            images,
            seed: -1,
            prompt,
            has_nsfw_concepts: false,
          },
          serviceSupabase,
          isGuest
        );
      }
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      requires_payment: false,
      message: 'Order queued for generation; results will appear once n8n callback completes.',
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

async function uploadImage(file: File, folder: string, supabase: any): Promise<string> {
  const buffer = await file.arrayBuffer()
  const fileName = `${folder}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  return publicUrl
}


///////////////////////////////////////////////////////////////// after n8n response /////////////////////////////////////////////////////////////////

async function uploadFalAiGeneratedImages(n8nResponse: any, supabase: any, isGuest: boolean) {
  try {

    const normalized = Array.isArray(n8nResponse)
      ? n8nResponse[0]
      : n8nResponse?.images
        ? n8nResponse
        : n8nResponse?.[0]
          ? n8nResponse[0]
          : n8nResponse

    const {
      order_id,
      images,
      seed,
      prompt,
      has_nsfw_concepts
    } = normalized;
    if (!order_id || !images || images.length === 0) {
      throw new Error('400 - Missing required data.order_id or images issue');
    }


    const { data: order } = await supabase
      .from('petiboo_orders')
      .select('is_guest')
      .eq('id', order_id)
      .single()

    if (!order) {
      throw new Error(`404 - Order not found. order_id:${order_id}`);
    }

    let imageData;
    const publicUrls = [];
    for (let j = 0; j < images.length; j++) { // generates as much as generated images 
      imageData = images[j];
      const fileName = `generated/${order_id}/${Date.now()}.jpg`
      const publicUrl = await uploadRemoteImage(supabase, imageData.url, fileName, imageData.content_type || 'image/jpeg')
      publicUrls.push(publicUrl)

      const { data: updatedRows, error: updateError } = await supabase
        .from('petiboo_generations')
        .update({
          fal_image_url: imageData.url,
          permanent_image_url: publicUrl,
          status: 'completed',
          width: imageData.width,
          height: imageData.height,
          content_type: imageData.content_type,
          seed: seed,
          prompt: prompt,
          has_nsfw_concepts: has_nsfw_concepts?.[0] || false,
          completed_at: new Date().toISOString(),
        })
        .eq('order_id', order_id)
        .eq('order_index', j)
        .select('id')

      if (updateError) {
        throw updateError
      }

      if (!updatedRows || updatedRows.length === 0) {
        const { error: insertError } = await supabase
          .from('petiboo_generations')
          .insert({
            order_id: order_id,
            has_watermark: isGuest,
            fal_image_url: imageData.url,
            permanent_image_url: publicUrl,
            status: 'completed',
            width: imageData.width,
            height: imageData.height,
            content_type: imageData.content_type,
            seed: seed,
            prompt: prompt,
            has_nsfw_concepts: has_nsfw_concepts?.[0] || false,
            completed_at: new Date().toISOString(),
            order_index: j,
          })

        if (insertError) {
          throw insertError
        }
      }
    }
    const { error: orderUpdateError } = await supabase
      .from('petiboo_orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', order_id)
    if (orderUpdateError) {
      throw orderUpdateError
    }

    const { data: orderData } = await supabase
      .from('petiboo_orders')
      .select('owner_image_original, pet_image_original')
      .eq('id', order_id)
      .single()

    if (orderData?.owner_image_original) {
      const path = orderData.owner_image_original.split('/images/')[1]
      await supabase.storage.from('images').remove([path])
    }

    if (orderData?.pet_image_original) {
      const path = orderData.pet_image_original.split('/images/')[1]
      await supabase.storage.from('images').remove([path])
    }
  } catch (error: any) {
    console.error('N8N response error:', error)
    throw error;
  }
}
