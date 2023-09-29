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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ButtonDeleteProps = {
  mutation: UseMutationResult<any, unknown, string, unknown> | undefined;
  uniqueField: string;
};

const ButtonDelete: React.FC<ButtonDeleteProps> = ({
  uniqueField,
  mutation,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='mx-auto block cursor-pointer text-red-400 transition hover:text-red-600'>
            <AlertDialogTrigger>
              <Trash className='h-4 w-4' />
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              if (!mutation) {
                console.log('Delete Mutation is undefined!');
                return;
              }

              mutation.mutate(uniqueField, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
              e.preventDefault();
            }}
          >
            {mutation && mutation.isLoading ? 'Loading...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDelete;
