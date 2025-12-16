import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { uploadRemoteImage } from '@/lib/supabase/storage'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[n8n callback] start upload - 0')

    // Use service role for storage + DB writes to bypass RLS for webhooks
    const supabase = createServiceRoleClient()
    const body = await request.json()
    console.log('[n8n callback] start upload - 1')

    const {
      order_id,
      request_id,
      images,
      seed,
      prompt,
      has_nsfw_concepts
    } = body

    if (!order_id || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }
    console.log('[n8n callback] start upload - 2')


    const { data: order } = await supabase
      .from('petiboo_orders')
      .select('is_guest')
      .eq('id', order_id)
      .single()
    console.log('[n8n callback] start upload - 3')

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    let imageData;
    const publicUrls = [];
    for (let i = 0; i < images.length; i++) { // generates as much as generated images 
      imageData = images[i];
      console.log('[n8n callback] start upload', { order_id, fileUrl: imageData.url })
      const fileName = `generated/${order_id}/${Date.now()}.jpg`
      const publicUrl = await uploadRemoteImage(supabase, imageData.url, fileName, imageData.content_type || 'image/jpeg')
      publicUrls.push(publicUrl)
      console.log('[n8n callback] upload complete', { order_id, fileName, publicUrl })

      await supabase
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
          completed_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .eq('order', i)
    }
    await supabase
      .from('petiboo_orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', order_id)

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

    return NextResponse.json({
      success: true,
      order_id,
      publicUrls,
      message: 'Generated image stored and order updated',
    })
  } catch (error: any) {
    console.error('N8N callback error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process callback' },
      { status: 500 }
    )
  }
}
