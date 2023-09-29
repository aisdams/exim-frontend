import Link from 'next/link';
import { Edit2 } from 'lucide-react';

import { DropdownMenuItem } from '../ui/dropdown-menu';

type ActionEditProps = {
  href: string;
  onClick?: () => void;
};

const ActionEdit: React.FC<ActionEditProps> = ({ href, onClick }) => {
  return (
    <Link href={href}>
      <button onClick={onClick} className="cursor-pointer w-full">
        <DropdownMenuItem className="gap-3">
          <Edit2 size={15} className="text-black" />
          Edit
        </DropdownMenuItem>
      </button>
    </Link>
  );
};

export default ActionEdit;
