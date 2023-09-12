import React from 'react';
import Sidebar from '@/components/layouts/sidebar';
import Topbar from '../../layouts/topbar';
import Logo from 'public/img/logo.png';
import Image from 'next/image';

export default function Content() {
  return (
    <div className="grid mt-52">
      <Image src={Logo} alt="" />
    </div>
  );
}
