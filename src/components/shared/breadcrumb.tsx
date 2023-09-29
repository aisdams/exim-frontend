import Link from 'next/link';
import { Breadcrumbs } from '@mantine/core';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  title: string | React.ReactNode;
  href?: string;
  disabled?: boolean;
};

export type BreadcrumbItems = BreadcrumbItem[];

type BreadcrumbProps = {
  items: BreadcrumbItems;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumbs
      separator={<ChevronRight size={13} />}
      className='mb-2 flex-wrap gap-y-1 text-xs'
      styles={{
        separator: {
          color: 'hsl(var(--muted-foreground))',
          marginInline: '.3rem',
        },
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx + 1 === items.length;
        const isMuted = item.disabled || !item.href || item.href === '#';

        return isMuted ? (
          <span
            key={idx}
            className={cn(
              isMuted && !isLast && 'text-muted-foreground',
              isLast && 'font-bold'
            )}
          >
            {item.title}
          </span>
        ) : (
          <Link key={idx} href={item.href || '#'} className='hover:underline'>
            {item.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
