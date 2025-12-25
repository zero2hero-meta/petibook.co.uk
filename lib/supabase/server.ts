import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type ServerClientOptions = {
  allowCookieWrite?: boolean
}

export const createServerClient = async ({ allowCookieWrite = false }: ServerClientOptions = {}) => {
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        ...(allowCookieWrite && {
          setAll: (cookiesToSet: { name: any; value: any; options: any }[]) => {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        }),
      },
    }
  )
}
