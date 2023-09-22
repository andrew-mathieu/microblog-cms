import supabase from '../createClient';
export async function GET(request: Request) {
    const data = await supabase.auth.getUser();
    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json'
        }
    })
}