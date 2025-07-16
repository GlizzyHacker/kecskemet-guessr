import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse<unknown> {
  const jwt = request.cookies.get('jwt');
  if (!jwt) {
    return NextResponse.redirect(new URL('/player', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/play', '/play/create', '/play/:id*'],
};
