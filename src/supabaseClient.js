import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lmxcposbxhusmupcffbf.supabase.co'
const supabaseKey = 'sb_publishable_6ndRk7iXg9J3xkAQHuW-bw_Xzgbc7V-'

export const supabase = createClient(supabaseUrl, supabaseKey)