import { createClient } from '@supabase/supabase-js';

// REMPLACEZ CES VALEURS PAR LES VÔTRES DEPUIS LE TABLEAU DE BORD SUPABASE
// Settings > API
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://pgtvhkfxarwyvswpazit.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_HmSygEHeVwRuSCoVEUAtxg_4pGvFQxS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);