import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select(`
        *,
        painter_count:profiles!profiles_company_id_fkey(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    console.log('companies length:', companies.length)
    
    const { data: allPayments, error: payError } = await supabase
      .from('payments')
      .select('amount, company_id')
      .eq('status', 'completed')
      
    if (payError) throw payError
    console.log('payments length:', allPayments?.length)
    
  } catch (err) {
    console.error('ERROR:', err)
  }
}
test()
