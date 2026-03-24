/**
 * Seed script to create 3 test accounts:
 * 1. Painter (user) - painter@test.com
 * 2. Company Admin - company@test.com
 * 3. Super Admin - superadmin@test.com
 * 
 * Run with: npx ts-node src/database/seed-accounts.ts
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEST_PASSWORD = 'Test1234!'

const accounts = [
  {
    email: 'painter@test.com',
    metadata: {
      first_name: 'Adebayo',
      last_name: 'Ogunwale',
      phone: '08012345678',
      state: 'Lagos',
      role: 'painter',
    }
  },
  {
    email: 'company@test.com',
    metadata: {
      first_name: 'Chioma',
      last_name: 'Enterprises',
      phone: '08098765432',
      state: 'Abuja',
      role: 'admin',
    }
  },
  {
    email: 'superadmin@test.com',
    metadata: {
      first_name: 'CAP',
      last_name: 'Platform Owner',
      phone: '08011111111',
      state: 'Lagos',
      role: 'super_admin',
    }
  },
]

async function seed() {
  console.log('🌱 Seeding test accounts...\n')

  for (const account of accounts) {
    // Use admin API to create user (bypasses email confirmation)
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: account.metadata,
    })

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log(`⚠️  ${account.email} already exists, skipping.`)
      } else {
        console.error(`❌ Failed to create ${account.email}:`, error.message)
      }
      continue
    }

    console.log(`✅ Created: ${account.email} (role: ${account.metadata.role})`)
  }

  console.log('\n📋 Test Account Credentials:')
  console.log('─'.repeat(50))
  console.log(`🎨 Painter:     painter@test.com     / ${TEST_PASSWORD}`)
  console.log(`🏢 Company:     company@test.com     / ${TEST_PASSWORD}`)
  console.log(`👑 Super Admin: superadmin@test.com   / ${TEST_PASSWORD}`)
  console.log('─'.repeat(50))
  console.log('\nDone!')
  process.exit(0)
}

seed().catch(console.error)
