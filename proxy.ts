import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  // Create a NextResponse object to pass to the Supabase client
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client with the response object
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          } catch (error) {
            // Handle cookie setting errors
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )

  // Get the user from the Supabase client
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  
  // Protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
    if (!user) {
      // Redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    // Check if the user is the specific admin user
    const allowedAdminId = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_UID
    if (user.id !== allowedAdminId) {
      // Redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}