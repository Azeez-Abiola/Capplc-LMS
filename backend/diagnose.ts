import { supabase } from './src/config/supabase';

async function diagnose() {
  const tables = [
    'profiles',
    'courses',
    'modules',
    'lessons',
    'enrollments',
    'payments',
    'subscriptions',
    'subscription_tiers',
    'certificates',
    'user_progress'
  ];

  console.log('--- Database Diagnostic ---');
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`❌ Table "${table}": ${error.message} (${error.code})`);
    } else {
      console.log(`✅ Table "${table}": Exists`);
    }
  }

  // Check specific columns often causing issues
  console.log('\n--- Column Checks ---');
  const { error: courseColError } = await supabase.from('courses').select('archived_at').limit(1);
  if (courseColError) console.error(`❌ "courses.archived_at": ${courseColError.message}`);
  else console.log(`✅ "courses.archived_at": Exists`);

  const { error: tierColError } = await supabase.from('courses').select('tier_access').limit(1);
  if (tierColError) console.error(`❌ "courses.tier_access": ${tierColError.message}`);
  else console.log(`✅ "courses.tier_access": Exists`);
}

diagnose();
