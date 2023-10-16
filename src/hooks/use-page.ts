import { useRouter } from 'next/router';

export const usePage = () => {
  const { pathname } = useRouter();

  const privatePage = !pathname.startsWith('/auth');

  return { privatePage };
};
