import { createClient } from '@supabase/supabase-js';

// Utilisation de import.meta.env pour Vite (évite le crash "process not defined" sur Netlify)
// Fallback sur les valeurs en dur si les variables d'env ne sont pas définies
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pgtvhkfxarwyvswpazit.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HmSygEHeVwRuSCoVEUAtxg_4pGvFQxS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);