import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client instance.
 * Avoids multiple instances across components and modules.
 * Includes fallback placeholders so static site generation during Next.js build doesn't throw.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      if (typeof window !== 'undefined') {
        console.warn(
          'Notice: Supabase environment variables missing. Operating in offline/mock demo mode.'
        );
      }
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();
