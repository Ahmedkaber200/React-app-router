// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

// export {supabase}

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://isnepiiacxdhypehsxww.supabase.co',
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmVwaWlhY3hkaHlwZWhzeHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTMzNDksImV4cCI6MjA3MTc2OTM0OX0.n1UxNDHlLZ-aCjQDkWlu7BNvvPRPfmxGPJ9vube0blI"
);
// const supabaseUrl = 'https://isnepiiacxdhypehsxww.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)