import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const IS_DEV = process.env.NODE_ENV === 'development';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrMessage(err: any) {
  const errMsg =
    err?.response?.data?.message || err?.message || 'Something went wrong!';

  if (IS_DEV) {
    console.log('err =>', errMsg);
  }

  return errMsg;
}
