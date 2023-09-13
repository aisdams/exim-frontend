import { useEffect, useState } from 'react';

export const useIsBelowSmallScreen = () => {
  const [isBelowSmallScreen, setIsBelowSmallScreen] = useState(false);

  const checkScreenSize = () => {
    if (window.innerWidth < 576) {
      setIsBelowSmallScreen(true);
    } else {
      setIsBelowSmallScreen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  });

  useEffect(() => {
    if (window.innerWidth < 576) {
      setIsBelowSmallScreen(true);
      return;
    }

    setIsBelowSmallScreen(false);
  }, []);

  return { isBelowSmallScreen };
};
