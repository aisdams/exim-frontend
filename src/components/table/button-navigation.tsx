import { LucideIcon } from 'lucide-react';

type ButtonNavigationProps = {
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
};

const ButtonNavigation: React.FC<ButtonNavigationProps> = ({
  onClick,
  disabled,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background p-0 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};
export default ButtonNavigation;
