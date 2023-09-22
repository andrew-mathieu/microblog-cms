import { createClient } from "@supabase/supabase-js";

const client = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
}
const { url, key } = client;
export default createClient(url, key);