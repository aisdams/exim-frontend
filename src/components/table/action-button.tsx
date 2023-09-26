import { LucideIcon } from 'lucide-react';

import { DropdownMenuItem } from '../ui/dropdown-menu';

type ActionButtonProps = {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  text,
  onClick,
}) => {
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();

        onClick instanceof Function && onClick();
      }}
    >
      <Icon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
      {text}
    </DropdownMenuItem>
  );
};
export default ActionButton;
