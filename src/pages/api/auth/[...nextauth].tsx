import { NextApiRequest, NextApiResponse } from 'next';
import { IS_DEV } from '@/constants';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, _req) {
          const response = await fetch(`${process.env.API_URL!}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          });
          const { data: user } = await response.json();

          // If no error and we have user data, return it
          if (response.ok && user) {
            return user;
          }
          // Return null if user data could not be retrieved
          return null;
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        // console.log('JWT CALLBACK', { token, user, session });
        if (user) {
          return {
            ...token,
            // ...user, //! old way (include the permissions property)
            email: user.email,
            name: user.name,
            role: user.role,
            // @ts-expect-error
            accessToken: user.accessToken,
            // @ts-expect-error
            accessTokenExpires: user.accessTokenExpires,
          };
        }

        return token;
      },
      async session({ session, token }) {
        // console.log('Session CALLBACK', { session, token, user });

        //! note: now / 1000 => to convert from miliseconds to seconds
        if (Date.now() / 1000 > token?.accessTokenExpires!) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            error: new Error(
              'Access token has expired. Please log in again to get a new access token.'
            ),
          });
        }

        //! override session.user with data from JWT
        const accessTokenData: User = JSON.parse(
          // @ts-expect-error
          atob(token.accessToken.split('.')?.at(1))
        );

        // accessTokenData = {
        //   ...accessTokenData,
        //   permissions: JSON.parse(accessTokenData.permissions), //! causes cookie size warnings
        // };

        session.user = {
          id: accessTokenData.id,
          email: accessTokenData.email,
          name: accessTokenData.name,
          role: accessTokenData.role,
          // permissions: accessTokenData.permissions, //! causes cookie size warnings
          iat: accessTokenData.iat,
          exp: accessTokenData.exp,
        };
        session.accessToken = token?.accessToken;
        session.accessTokenExpires = token?.accessTokenExpires;

        return session;
      },
    },
    session: {
      strategy: 'jwt',
    },
    secret: process.env.JWT_SECRET,
    pages: {
      signIn: '/auth/login',
    },
    debug: IS_DEV,
  });
}
