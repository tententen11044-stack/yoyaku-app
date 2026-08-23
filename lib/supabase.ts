import { createClient } from "@supabase/supabase-js";

// Supabase への接続情報。値は .env.local に置き、GitHub には送らない。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ReservationRow = {
  id: string;
  name: string;
  starts_at: string;
  location: string;
  created_at: string;
};
