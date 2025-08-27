import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  const jwt = request.cookies.get('jwt');
  const role = getRoleFromJwt(jwt?.value);
  const cookieStore = await cookies();
  if (!role) {
    cookieStore.set('path', request.nextUrl.pathname);
    return NextResponse.redirect(new URL('/player', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/admin') && role != 'SUPERUSER') {
    cookieStore.set('path', request.nextUrl.pathname);
    return NextResponse.redirect(new URL('/admin/auth', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/play', '/play/create', '/play/:id*'],
};

export const getRoleFromJwt = (jwtToken?: string): string | null => {
  if (!jwtToken) {
    return null;
  }
  try {
    const dataFromjwt = decode(jwtToken);

    if (typeof dataFromjwt === 'string') {
      return null;
    }
    // const payload: JwtPayload = dataFromjwt as JwtPayload;
    // if ((payload.exp || 0) < new Date().getTime() / 1000) {
    //   return null;
    // }
    return dataFromjwt?.role || null;
  } catch {
    return null;
  }
};
