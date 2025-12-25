import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { createServerClient } from '@/lib/supabase/server'
import { PACKAGES } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const pkgKey = body?.package as keyof typeof PACKAGES | undefined
    const pkg = pkgKey ? PACKAGES[pkgKey] : null

    if (!pkg || pkgKey === 'free') {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' })
    const origin = request.nextUrl.origin

    if (!pkgKey || !pkg || pkgKey === 'free') {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(pkg.price * 100),
            product_data: {
              name: `${pkg.name} Package`,
              metadata: {
                package_key: pkgKey,
              },
            },
          },
        },
      ],
      success_url: `${origin}/create?session_id={CHECKOUT_SESSION_ID}&package=${pkgKey}`,
      cancel_url: `${origin}/checkout/cancel?package=${pkgKey}`,
      metadata: {
        package_key: pkgKey,
        user_id: user.id,
      },
    };

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
