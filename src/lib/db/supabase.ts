// src/lib/db/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || "https://weqbvqaepyxdpghxlsbq.supabase.co";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseAnonKey) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}
