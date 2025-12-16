import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreditCard } from 'lucide-react'

export default async function PaymentHistoryPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: payments } = await supabase
    .from('petiboo_payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
            Payment History
          </h1>
          <p className="text-gray-600">View your transaction history</p>
        </div>

        {!payments || payments.length === 0 ? (
          <div className="card text-center py-16">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-700">No Payments Yet</h2>
            <p className="text-gray-600">
              You haven't made any purchases yet.
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: any) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        £{payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'succeeded'
                              ? 'bg-green-100 text-green-700'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                        {payment.stripe_payment_intent_id.substring(0, 20)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
