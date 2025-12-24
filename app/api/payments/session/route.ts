import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { PACKAGES } from '@/types'
import { createServiceRoleClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const sessionId = request.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' || session.status !== 'complete') {
      return NextResponse.json({ error: 'Session not paid' }, { status: 402 })
    }

    const pkg = session.metadata?.package_key
    const userId = session.metadata?.user_id
    const packageConfig = pkg ? PACKAGES[pkg as keyof typeof PACKAGES] : null
    const amount = session.amount_total ? session.amount_total / 100 : null
    const currency = session.currency?.toUpperCase() || 'GBP'
    const paymentIntentId = session.payment_intent as string | null

    // Fallback upsert in case webhook hasn't arrived yet
    if (paymentIntentId) {
      const supabase = createServiceRoleClient()
      await supabase
        .from('petiboo_payments')
        .upsert({
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          user_id: userId || null,
          order_id: session.metadata?.order_id || null,
          amount: amount ?? 0,
          currency,
          package: pkg,
          status: 'succeeded',
          payment_method: session.payment_method_types?.[0],
          paid_at: new Date().toISOString(),
        }, {
          onConflict: 'stripe_payment_intent_id'
        })

      if (packageConfig && userId) {
        const remainingImages = packageConfig.images_per_style * packageConfig.max_styles
        await supabase
          .from('petiboo_quotas')
          .upsert({
            user_id: userId,
            package: pkg,
            remaining_images: remainingImages,
            remaining_styles: packageConfig.max_styles,
            images_per_style: packageConfig.images_per_style,
            max_styles: packageConfig.max_styles,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })
      }
    }

    return NextResponse.json({
      package: pkg,
      payment_intent_id: paymentIntentId,
      customer_email: session.customer_details?.email,
      user_id: userId,
    })
  } catch (error: any) {
    console.error('Stripe session lookup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: 500 }
    )
  }
}
