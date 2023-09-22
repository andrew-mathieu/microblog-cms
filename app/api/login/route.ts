import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from '../createClient';

export async function POST(request: Request) {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
    })
    const response = NextResponse.next()
    response.cookies.set(data as any);

    if (data) {
        return NextResponse.json({ data });
    } else {
        return NextResponse.json({ error });
    }

}