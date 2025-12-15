import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

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

    const imageData = images[0]

    const { data: order } = await supabase
      .from('petiboo_orders')
      .select('is_guest')
      .eq('id', order_id)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const imageResponse = await fetch(imageData.url)
    const imageBuffer = await imageResponse.arrayBuffer()

    const fileName = `generated/${order_id}/${Date.now()}.jpg`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('N8N callback error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process callback' },
      { status: 500 }
    )
  }
}
