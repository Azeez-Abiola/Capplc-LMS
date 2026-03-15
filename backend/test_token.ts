import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testToken() {
  const token = process.argv[2]
  if (!token) {
    console.log('Usage: npx ts-node test_token.ts <JWT_TOKEN>')
    return
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error) {
    console.error('❌ Token Invalid:', error.message)
  } else {
    console.log('✅ Token Valid for User:', data.user.email)
    console.log('Metadata:', data.user.user_metadata)
  }
}

testToken()
