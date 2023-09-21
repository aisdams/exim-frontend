import React, { useState } from 'react';
import BgLog from 'public/img/bg-log.jpg';
import Logo from '../../../public/img/logo.png';
import Image from 'next/image';
import { User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Login() {
  const username = useState('');
  const password = useState('');

  return (
    <div className="bg-[url('/public/img/bg-log.jpg')] bg-cover bg-center">
      <div className="mx-auto justify-center items-center bg-white shadow-xl w-60">
        <div className="">
          <Image src={Logo} alt="" />
        </div>

        <div className="flex items-center">
          <User />
          <Input name="username" placeholder="Username...." />
        </div>
        <div className="flex items-center">
          <Lock />
          <Input name="password" placeholder="Password...." />
        </div>

        <Button className="bg-blueLight px-3 py-1 hover:bg-bluePrimary">
          Submit
        </Button>

        <p>
          Do You Have Account ? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
