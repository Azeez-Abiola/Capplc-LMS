import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🚀 Starting Seeding...')

  // 1. Subscription Tiers
  const { data: tiers, error: tierErr } = await supabase
    .from('subscription_tiers')
    .upsert([
      { name: 'free', price: 0, level: 0 },
      { name: 'PRO', price: 5000, level: 1 },
      { name: 'ELITE', price: 15000, level: 2 }
    ], { onConflict: 'name' })
    .select()

  if (tierErr) console.error('❌ Tiers Error:', tierErr.message)
  else console.log('✅ Tiers Seeded')

  // 2. Courses
  const { data: courses, error: courseErr } = await supabase
    .from('courses')
    .upsert([
      {
        title: 'Mastering Surface Prep: The CAP Standard',
        description: 'Learn the essential techniques for surface preparation before painting.',
        tier_access: 'free',
        duration_minutes: 105,
        status: 'published'
      },
      {
        title: 'Luxury Finishes: Silk & Texture Portfolio',
        description: 'Advanced texture application techniques for high-end residential projects.',
        tier_access: 'PRO',
        duration_minutes: 130,
        status: 'published'
      },
      {
        title: 'Industrial Coating: Airless Spraying Mastery',
        description: 'Master the use of industrial spraying systems for large-scale projects.',
        tier_access: 'ELITE',
        duration_minutes: 195,
        status: 'published'
      }
    ], { onConflict: 'title' })
    .select()

  if (courseErr) {
    if (courseErr.message.includes('duration_minutes')) {
      console.error('❌ Courses Error: Missing "duration_minutes" column. PLEASE RUN THE patch_columns.sql SCRIPT IN SUPABASE FIRST.')
    } else {
      console.error('❌ Courses Error:', courseErr.message)
    }
  } else {
    console.log('✅ Courses Seeded')
  }

  // 3. Modules & Lessons for each course
  if (courses) {
    for (const course of courses) {
      console.log(`\n  --- Seeding Modules for "${course.title}" ---`)
      
      const { data: modules, error: modErr } = await supabase
        .from('modules')
        .upsert([
          { course_id: course.id, title: 'Introduction & Safety', order: 1, description: 'Safety protocols and tool overview.' },
          { course_id: course.id, title: 'Fundamental Techniques', order: 2, description: 'Core application methods.' }
        ], { onConflict: 'id' }) // Upsert on courses usually generates new IDs, so careful here
        .select()

      if (modErr) console.error('  ❌ Modules Error:', modErr.message)
      else if (modules) {
        console.log('  ✅ Modules Seeded')
        for (const module of modules) {
          await supabase.from('lessons').upsert([
            { module_id: module.id, course_id: course.id, title: `${module.title} - Part 1`, video_url: 'https://vimeo.com/...', order: 1 },
            { module_id: module.id, course_id: course.id, title: `${module.title} - Q&A`, video_url: 'https://vimeo.com/...', order: 2 }
          ])
        }
        console.log('  ✅ Lessons Seeded')
      }
    }
  }

  console.log('\n🌟 Seeding Completed!')
}

seed()
