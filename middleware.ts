/* eslint-disable consistent-return */
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    cookieName: process.env.NEXTAUTH_SESSION_TOKEN,
  });

  const privatePage = !pathname.startsWith('/auth');
  const isTokenExpired =
    !token?.accessTokenExpires ||
    !(Date.now() / 1000 < token?.accessTokenExpires!);

  //! token expired logic
  if (isTokenExpired) {
    //! removing cookie & redirect to auth page
    if (req.cookies.has(process.env.NEXTAUTH_SESSION_TOKEN)) {
      response.cookies.set(process.env.NEXTAUTH_SESSION_TOKEN, '', {
        expires: new Date(Date.now()),
      });

      if (privatePage)
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  //! unauthenticated user CAN'T access private page
  if (privatePage && !token?.accessToken && isTokenExpired) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  //! authenticated user CAN'T access auth page
  if (pathname.startsWith('/auth') && token?.accessToken && !isTokenExpired) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  //! role authorization example
  // redirect user without admin access to login
  // if (!token?.isAdmin) {
  //   return NextResponse.redirect('/auth/login');
  // }

  // TODO:
  // const isAllowed = token?.permissions?.find((p) => {
  //   if(p)
  // })

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|403).*)',
    '/',
  ],
};
