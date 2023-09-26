import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

type ActionLinkProps = {
  tag?: 'a' | 'Link';
  href: string;
  icon: LucideIcon;
  text: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

const ActionLink: React.FC<ActionLinkProps> = ({
  tag = 'Link',
  href,
  icon: Icon,
  text,
  isDisabled,
  onClick,
}) => {
  return (
    <DropdownMenuItem className="p-0" disabled={isDisabled}>
      {tag === 'a' ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
          onClick={() => {
            onClick instanceof Function && onClick();
          }}
        >
          <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          {text}
        </a>
      ) : (
        <Link
          href={href}
          className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
          onClick={() => {
            onClick instanceof Function && onClick();
          }}
        >
          <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          {text}
        </Link>
      )}
    </DropdownMenuItem>
  );
};
export default ActionLink;
