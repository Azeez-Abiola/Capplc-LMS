import { supabase } from './src/config/supabase';

async function checkStructure() {
  const tables = ['courses', 'payments', 'profiles', 'subscriptions', 'subscription_tiers'];
  
  for (const table of tables) {
    console.log(`\n--- ${table} structure ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('No data in table');
    }
  }
}

checkStructure();
