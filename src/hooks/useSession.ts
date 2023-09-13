import { useAppSelector } from '@/redux/hooks';

export const useSession = () => {
  const authSession = useAppSelector((state) => state.auth);

  return {
    data: authSession,
  };
};
