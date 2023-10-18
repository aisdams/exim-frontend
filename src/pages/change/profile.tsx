import React from 'react';
import Image from 'next/image';
import { User2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Avatar from 'public/img/avatar.png';

import InputPassword from '@/components/inputs/rhf/input-password';
import InputText from '@/components/inputs/rhf/input-text';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex rounded-xl border border-graySecondary/50 dark:bg-secondDarkBlue">
        <div className="">
          <Image src={Avatar} alt="" width={80} height={80} />
        </div>

        <div className=""></div>
        <div className="">
          <InputText name="name" placeholder="Name..." />
        </div>
        <div className="">
          <InputText name="email" placeholder="Email..." />
        </div>
        <div className="">
          <InputPassword name="username" placeholder="Password..." />
        </div>
      </div>
    </div>
  );
}
