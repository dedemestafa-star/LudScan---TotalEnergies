'use server'

import { createClient } from '@supabase/supabase-js'

// SERVICE ROLE CLIENT - SERVER ONLY
export async function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}