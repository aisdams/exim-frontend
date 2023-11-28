import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Avatar from 'public/img/avatar.png';

import InputPassword from '@/components/form/input-password';
import InputText from '@/components/form/input-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>User Profile</h1>
      <div className="w-max rounded-xl border border-graySecondary/50 px-10 dark:bg-secondDarkBlue">
        <div className="flex gap-5 p-5">
          <div className="">
            <Image src={Avatar} alt="" width={100} height={100} />
          </div>

          <div className="grid">
            <div className="grid grid-cols-2">
              <div>
                <h1>Name: </h1>
                <h1>Sebagai: </h1>
                <h1>Email :</h1>
              </div>
              <div>
                <div>{session?.user?.name}</div>
                <div>{session?.user?.role}</div>
                <div>{session?.user?.email}</div>
              </div>
            </div>

            {/* <Button className="mt-5 bg-blue-500">
              <Link href="/profile/change">Change Profile</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
