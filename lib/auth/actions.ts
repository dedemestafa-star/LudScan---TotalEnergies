import { createClient } from '@/lib/supabase/browser'

// Sign in
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  return { user: data?.user ?? null, error }
}
