import React from 'react';
import { CopyIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ActionCopy() {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CopyIcon />
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
