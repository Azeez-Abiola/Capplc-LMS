import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') })

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
      full_name: 'Super Admin User'
    },
    {
      email: 'admin@company.com',
      password: 'Admin123!',
      role: 'admin',
      full_name: 'Company Admin User'
    },
    {
      email: 'painter@cap.com',
      password: 'Painter123!',
      role: 'painter',
      full_name: 'Regular Painter'
    }
  ]

  for (const userData of users) {
    console.log(`Creating user: ${userData.email}...`)
    
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`User ${userData.email} already exists. Skipping auth creation.`)
        // Try to find the user to update profile
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === userData.email)
        if (existingUser) {
           await updateProfile(existingUser.id, userData.role, userData.full_name)
        }
      } else {
        console.error(`Error creating ${userData.email}:`, authError.message)
      }
      continue
    }

    if (authData.user) {
      await updateProfile(authData.user.id, userData.role, userData.full_name)
    }
  }

  console.log('✅ Seeding complete!')
}

async function updateProfile(id: string, role: string, fullName: string) {
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      role, 
      full_name: fullName,
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
        full_name: fullName,
        updated_at: new Date().toISOString()
      })
    if (insertError) console.error(`Error updating profile for ${id}:`, insertError.message)
  } else {
    console.log(`Updated profile for ${id} with role ${role}`)
  }
}

seedUsers()
