import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedUsers() {
  console.log('🚀 Seeding users...')

  const users = [
    {
      email: 'superadmin@cap.com',
      password: 'SuperAdmin123!',
      role: 'super_admin',
      firstName: 'Super',
      lastName: 'Admin'
    },
    {
      email: 'admin@company.com',
      password: 'Admin123!',
      role: 'admin',
      firstName: 'Company',
      lastName: 'Admin'
    },
    {
      email: 'painter@cap.com',
      password: 'Painter123!',
      role: 'painter',
      firstName: 'Regular',
      lastName: 'Painter'
    }
  ]

  for (const userData of users) {
    console.log(`Creating user: ${userData.email}...`)
    
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role
      }
    })

    if (authError) {
      const msg = authError.message.toLowerCase()
      console.log(`Auth error for ${userData.email}: "${authError.message}"`)
      if (msg.includes('already registered') || msg.includes('already_registered') || authError.status === 422) {
        console.log(`User ${userData.email} already exists. Fetching existing user list...`)
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) console.error('Error listing users:', listError.message)
        
        const username = userData.email.toLowerCase()
        const existingUser = listData?.users.find((u: any) => u.email?.toLowerCase() === username)
        if (existingUser) {
           console.log(`Found existing user ${existingUser.id}. Updating profile...`)
           await updateProfile(existingUser.id, userData.role, userData.firstName, userData.lastName)
        } else {
           console.log(`Could not find user ${username} in list of ${listData?.users.length} users.`)
        }
      } else {
        console.error(`Unexpected error creating ${userData.email}:`, authError.message)
      }
      continue
    }

    if (authData.user) {
      await updateProfile(authData.user.id, userData.role, userData.firstName, userData.lastName)
    }
  }

  console.log('✅ Seeding complete!')
}

async function updateProfile(id: string, role: string, firstName: string, lastName: string) {
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      role, 
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (profileError) {
    // If update fails, maybe it doesn't exist? Try insert
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({ 
        id, 
        role, 
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString()
      })
    if (insertError) console.error(`Error updating profile for ${id}:`, insertError.message)
  } else {
    console.log(`Updated profile for ${id} with role ${role}`)
  }
}

seedUsers()
