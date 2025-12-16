import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const storageClient = createServiceRoleClient()
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

    const ownerOptimized = await uploadImage(ownerImage, 'optimized', storageClient)
    const ownerOriginal = await uploadImage(ownerImage, 'original', storageClient)
    const petOptimized = await uploadImage(petImage, 'optimized', storageClient)
    const petOriginal = await uploadImage(petImage, 'original', storageClient)

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
        console.log(`[n8n webhook] response - n8nData: ${JSON.stringify(n8nData, null, 2)}`);
        console.log('[n8n webhook] queued', { order_id: order.id, request_id: n8nData.request_id, callbackUrl })
        const images: any[] = n8nData.images || [];
        for (let i = 0; i < images.length; i++) {
          console.log(`[n8n webhook] image data: ${JSON.stringify(i, null, 2)}`);

          await supabase.from('petiboo_generations').insert({
            order_id: order.id,
            n8n_request_id: n8nData.request_id,// || `manual_${Date.now()}`,
            status: 'queued',
            has_watermark: isGuest
          });
        }
        // const callbackUrl = `${request.nextUrl.origin}/api/n8n/callback`
        await fetch(callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: order.id,
            ...n8nData
          })
        })



        await supabase
          .from('petiboo_orders')
          .update({ status: 'processing', processing_started_at: new Date().toISOString() })
          .eq('id', order.id)
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
