// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

// export {supabase}

import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const supabase = createClient(
  "https://isnepiiacxdhypehsxww.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmVwaWlhY3hkaHlwZWhzeHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTMzNDksImV4cCI6MjA3MTc2OTM0OX0.n1UxNDHlLZ-aCjQDkWlu7BNvvPRPfmxGPJ9vube0blI"
);

export const get = async (table: string, id?: string | number) => {
  let query:any = supabase.from(table).select("*");

  if (id) {
    query = query.eq("id", id).single(); 
  }

  const { data, error } = await query;

  if (error) {
    toast.error(error.message);
    return id ? null : [];
  }

  return data;
};

export const post = async (table:string,body:any) => {
  const { data, error } = await supabase.from(table).insert(body);
  if (error) {
    toast.error(error.message);
    return [];
  }
  return data;
};

export const del = async (table: string, id: number) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id) // 👈 filter condition
    .select();

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return data;
};

export const put = async (table: string, id: any, body:any) => {
  const { data, error } = await supabase
    .from(table)
    .update(body) // 👈 update data
    .eq("id", id) // 👈 filter by id
    .select();    // 👈 return updated row(s)

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return data;
};

export const setToken = (key: string, token: string) => {
  Cookies.set(key, token);
};


// const supabaseUrl = 'https://isnepiiacxdhypehsxww.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)
