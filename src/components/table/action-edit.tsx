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
      <a onClick={onClick} className="cursor-pointer">
        <DropdownMenuItem>
          <Edit2 size={20} />
          Edit
        </DropdownMenuItem>
      </a>
    </Link>
  );
};

export default ActionEdit;
