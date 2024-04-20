import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_API_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
