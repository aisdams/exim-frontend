import { useEffect } from 'react';

import useConfigStore from '@/zustand/use-config';

export function ThemeSwitcher() {
  const theme = useConfigStore((state) => state.theme);

  useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.match(/^theme.*/)) {
        document.body.classList.remove(className);
      }
    });

    if (theme) {
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return null;
}
