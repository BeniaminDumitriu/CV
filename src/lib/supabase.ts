import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  message?: string
  created_at: string
  status: 'new' | 'read' | 'replied'
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
} 