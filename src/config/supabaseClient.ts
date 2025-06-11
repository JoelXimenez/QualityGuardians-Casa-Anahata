import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Las variables de entorno de Supabase (URL y KEY) no están definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);