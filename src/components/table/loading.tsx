import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

type LodaerProps = {
  dark?: boolean;
  size?: 'xs' | 'sm' | 'default';
  className?: string;
};

const Loader: React.FC<LodaerProps> = ({
  dark = true,
  size = 'default',
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'loader',
        size === 'xs' && 'text-[1.5px]',
        size === 'sm' && 'text-[2px]',
        size === 'default' && 'text-[3px]',
        theme === 'light' && 'loader-dark',
        dark ? '' : 'loader-dark',
        className
      )}
    />
  );
};

export default Loader;
