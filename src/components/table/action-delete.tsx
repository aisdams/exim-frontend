import { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Trash } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';

type ActionDeleteProps = {
  mutation: UseMutationResult<any, unknown, string, unknown> | undefined;
  uniqueField: string;
  onDeleteSucceed?: () => void;
};

const ActionDelete: React.FC<ActionDeleteProps> = ({
  uniqueField,
  mutation,
  onDeleteSucceed,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
      }}
      className="p-0"
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="flex w-full select-none items-center px-2 py-1.5 font-sans hover:cursor-default">
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete
        </AlertDialogTrigger>

        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-sans">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();

                if (!mutation) {
                  console.log('Delete Mutation is undefined!');
                  return;
                }

                mutation.mutate(uniqueField, {
                  onSuccess: () => {
                    setOpen(false);

                    onDeleteSucceed instanceof Function && onDeleteSucceed();
                  },
                });
              }}
              className="bg-primary font-sans !text-white hover:bg-purple-700 dark:brightness-95 dark:hover:bg-purple-800"
            >
              {mutation && mutation.isLoading ? 'Loading...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
};

export default ActionDelete;
