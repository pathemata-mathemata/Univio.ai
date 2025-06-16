import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in build time (environment variables might not be available)
const isBuildTime = !supabaseUrl || !supabaseServiceKey || !supabaseAnonKey

// Create a dummy client for build time to prevent errors
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Build time - no database access' } }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Build time - no database access' } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Build time - no database access' } }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Build time - no database access' } }) }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Build time - no database access' } }) })
    })
  } as any
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = isBuildTime 
  ? createDummyClient()
  : createClient<Database>(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

// Regular server-side client for user operations
export const supabaseServer = isBuildTime
  ? createDummyClient()
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }) 