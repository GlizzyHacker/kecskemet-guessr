import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const jwt = request.nextUrl.searchParams.get('jwt');

  if (!jwt) {
    return new Response('Unauthorized', { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('jwt', jwt, { path: '/' });

  return NextResponse.redirect(new URL(cookieStore.get('path')?.value ?? '/player', request.url));
}
