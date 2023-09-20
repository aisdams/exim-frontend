import React from 'react';
import BgLog from 'public/img/bg-log.jpg';
import Logo from '../../../public/img/logo.png';
import Image from 'next/image';
import { User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <div className="bg-[url('/public/img/bg-log.jpg')] bg-cover bg-center">
      <div className="mx-auto justify-center items-center bg-white shadow-xl">
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
      </div>
    </div>
  );
}
