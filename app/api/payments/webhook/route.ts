import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { PACKAGES } from '@/types'
import { createServiceRoleClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret || !webhookSecret) {
    console.error('Stripe webhook missing configuration')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' })

  const sig = request.headers.get('stripe-signature')
  const body = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig || '', webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata || {}
        const paymentIntentId = session.payment_intent as string | null
        const amount = session.amount_total ? session.amount_total / 100 : null
        const currency = session.currency?.toUpperCase() || 'GBP'
        const packageKey = metadata.package_key
        const packageConfig = packageKey ? PACKAGES?.[packageKey as keyof typeof PACKAGES] : null

        if (!paymentIntentId) {
          throw new Error('Missing payment intent on checkout.session.completed')
        }

        const supabase = createServiceRoleClient()
        const { error: upsertError } = await supabase
          .from('petiboo_payments')
          .upsert({
            stripe_payment_intent_id: paymentIntentId,
            stripe_session_id: session.id,
            user_id: metadata.user_id || null,
            order_id: metadata.order_id || null,
            amount: amount ?? 0,
            currency,
            package: packageKey,
            status: 'succeeded',
            payment_method: session.payment_method_types?.[0],
            paid_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_payment_intent_id'
          })

        if (upsertError) throw upsertError

        if (packageConfig && metadata.user_id) {
          const remainingImages = packageConfig.images_per_style * packageConfig.max_styles
          const { error: quotaError } = await supabase
            .from('petiboo_quotas')
            .upsert({
              user_id: metadata.user_id,
              package: packageKey,
              remaining_images: remainingImages,
              remaining_styles: packageConfig.max_styles,
              images_per_style: packageConfig.images_per_style,
              max_styles: packageConfig.max_styles,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id'
            })

          if (quotaError) throw quotaError
        }
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook handling error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
