import React from 'react';
import { User2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Profile() {
  return (
    <div>
      <div className="flex rounded-xl border border-graySecondary/50 dark:bg-secondDarkBlue">
        <div className="text-3xl">
          <User2 />
        </div>

        <div className="">
          <Input name="username" placeholder="Username..." />
        </div>
        <div className="">
          <Input name="username" placeholder="Password..." />
        </div>
      </div>
    </div>
  );
}
