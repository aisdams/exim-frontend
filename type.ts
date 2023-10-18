// /* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace NodeJS {
  export interface ProcessEnv {
    API_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_SESSION_TOKEN: string;
    JWT_NAME: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_PERMISSIONS_NAME: string;
  }
}
