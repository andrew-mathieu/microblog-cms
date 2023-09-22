import supabase from '../createClient';
export async function GET(request: Request) {
    const table = await supabase.from("posts").select('*')
    return new Response(JSON.stringify(table), {
        headers: {
            'content-type': 'application/json'
        }
    })
}