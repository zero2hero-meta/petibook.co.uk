import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { uploadRemoteImage } from '@/lib/supabase/storage'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const serviceSupabase = createServiceRoleClient()
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[n8n webhook] debug-1');

    const formData = await request.formData()
    const ownerImage = formData.get('owner_image') as File
    const petImage = formData.get('pet_image') as File
    const email = formData.get('email') as string
    const isGuest = formData.get('is_guest') === 'true'
    console.log('[n8n webhook] debug-2');

    if (!ownerImage || !petImage || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    console.log('[n8n webhook] debug-3');

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
    console.log('[n8n webhook] debug-4');

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
        package: 'free',
        num_images: 1,
        is_guest: isGuest,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError
    console.log('[n8n webhook] debug-5');

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
          callback_url: callbackUrl,
        })
      })

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        console.error('[n8n webhook] failed', n8nResponse.status, errorText)
      } else {



        const n8nData = await n8nResponse.json()
        // const n8nData = [
        //   {
        //     "images": [
        //       {
        //         "url": "https://v3b.fal.media/files/b/0a869900/CCjsUIg0kOajt8ggZobmI_8619deff27ec4f85a5ac814573a3d3bf.jpg",
        //         "width": 1024,
        //         "height": 1024,
        //         "content_type": "image/jpeg"
        //       }
        //     ],
        //     "timings": {},
        //     "seed": 3955154547,
        //     "has_nsfw_concepts": [
        //       false
        //     ],
        //     "prompt": "Create a humorous caricature of the pet from the second image, but with the owner's facial characteristics subtly applied to it. The pet should maintain its species and general appearance, but its facial features (eyes, nose, mouth, expression, face shape) should be modified to humorously resemble the owner from the first image. Use a playful cartoon style with bold outlines, vibrant colors, and exaggerated features to emphasize the comedic resemblance between pet and owner. Keep the pet's body and pose, but transform the face into a funny blend that makes it look like 'this pet definitely belongs to this person.' Use flat 2D colors, bold black outlines, and simplified shapes in the style of the old TV cartoon. Plain, simple background."
        //   }
        // ]



        console.log(`[n8n webhook] response - n8nData: ${JSON.stringify(n8nData, null, 2)}`);
        console.log('[n8n webhook] queued', { order_id: order.id, callbackUrl })

        const firstResult: any = Array.isArray(n8nData) ? n8nData[0] : n8nData
        const images: any[] = firstResult?.images || []

        await serviceSupabase
          .from('petiboo_orders')
          .update({ status: 'processing', processing_started_at: new Date().toISOString() })
          .eq('id', order.id)

        await uploadFalAiGeneratedImages(
          {
            order_id: order.id,
            images,
            seed: firstResult?.seed,
            prompt: firstResult?.prompt,
            has_nsfw_concepts: firstResult?.has_nsfw_concepts,
          },
          serviceSupabase,
          isGuest
        );
      }
    }
    console.log('[n8n webhook] debug-6');

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

export async function uploadFalAiGeneratedImages(n8nResponse: any, supabase: any, isGuest: boolean) {
  try {
    console.log('[n8n response] start upload - 0')

    // Use service role for storage + DB writes to bypass RLS for webhooks
    // const supabase = createServiceRoleClient()
    // const body = await request.json()
    console.log('[n8n response] start upload - 1', { n8nResponse })

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
    console.log('[n8n response] start upload - 1.5', { order_id, imagesLength: images?.length });
    if (!order_id || !images || images.length === 0) {
      throw new Error('400 - Missing required data.order_id or images issue');
    }
    console.log('[n8n response] start upload - 2')


    const { data: order } = await supabase
      .from('petiboo_orders')
      .select('is_guest')
      .eq('id', order_id)
      .single()
    console.log('[n8n response] start upload - 3')

    if (!order) {
      throw new Error(`404 - Order not found. order_id:${order_id}`);
    }

    let imageData;
    const publicUrls = [];
    console.log('[n8n response] start upload - 4', { imagesLength: images.length });
    for (let j = 0; j < images.length; j++) { // generates as much as generated images 
      imageData = images[j];
      console.log('[n8n response] start upload', { order_id, fileUrl: imageData.url })
      const fileName = `generated/${order_id}/${Date.now()}.jpg`
      const publicUrl = await uploadRemoteImage(supabase, imageData.url, fileName, imageData.content_type || 'image/jpeg')
      publicUrls.push(publicUrl)
      console.log('[n8n response] upload complete', { order_id, fileName, publicUrl })

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
    console.log('[n8n response] all images uploaded, updating order status', { order_id });
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
    console.log('[n8n response] all uploads complete', { order_id, publicUrls: JSON.stringify(publicUrls) })
  } catch (error: any) {
    console.error('N8N response error:', error)
    throw error;
  }
}
