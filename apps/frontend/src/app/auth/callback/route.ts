import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const jwt = request.nextUrl.searchParams.get('jwt');

  if (!jwt) {
    return new Response('Unauthorized', { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('jwt', jwt, { path: '/' });

  return NextResponse.redirect('https://3pcdhvbt-3000.euw.devtunnels.ms');
}
