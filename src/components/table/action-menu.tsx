import React, { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { LucideIcon, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActionDelete from './action-delete';
import ActionEdit from './action-edit';
import ActionLink from './action-link';

type LinkAction = {
  icon: LucideIcon;
  text: string;
  href: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

type ActionMenuProps = {
  children?: React.ReactNode;
  linksProps?: LinkAction | LinkAction[];
  editProps?: {
    href: string;
  };
  deleteProps?: {
    mutation: UseMutationResult<any, unknown, string, unknown> | undefined;
    uniqueField: string;
  };
};

const ActionMenu: React.FC<ActionMenuProps> = ({
  children,
  linksProps,
  editProps,
  deleteProps,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='font-normal'>
        {children}

        {Array.isArray(linksProps)
          ? linksProps.map((l) => (
              <ActionLink
                key={l.href}
                href={l.href}
                icon={l.icon}
                text={l.text}
                isDisabled={l.isDisabled}
                onClick={() => {
                  setOpen(false);

                  l?.onClick instanceof Function && l.onClick();
                }}
              />
            ))
          : linksProps && (
              <ActionLink
                href={linksProps.href}
                icon={linksProps.icon}
                text={linksProps.text}
                isDisabled={linksProps.isDisabled}
                onClick={() => {
                  setOpen(false);

                  linksProps?.onClick instanceof Function &&
                    linksProps.onClick();
                }}
              />
            )}

        {editProps && (
          <ActionEdit href={editProps.href} onClick={() => setOpen(false)} />
        )}

        {deleteProps && (
          <ActionDelete
            uniqueField={deleteProps.uniqueField}
            mutation={deleteProps.mutation}
            onDeleteSucceed={() => setOpen(false)}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionMenu;
