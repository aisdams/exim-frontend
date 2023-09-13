import { useWindowSize } from '@react-hookz/web';

export const useIsMediumScreen = () => {
  const size = useWindowSize();
  const isMediumScreen = size.width > 768;

  return { isMediumScreen };
};
