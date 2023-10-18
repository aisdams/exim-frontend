import { DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string;
    iat: number;
    exp: number;
    // accessToken: string;
    // accessTokenExpires: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    // refreshTokenExpires?: number;
    accessTokenExpires?: number;
    // refreshToken?: string;
    accessToken?: string;
    error?: string;
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    exp?: number;
    iat?: number;
    jti?: string;
    // refreshTokenExpires?: number;
    accessTokenExpires?: number;
    // refreshToken?: string;
    accessToken: string;
    role: string;
  }
}
