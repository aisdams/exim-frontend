import { useTheme } from 'next-themes';

export const useIsDark = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return { isDark };
};
