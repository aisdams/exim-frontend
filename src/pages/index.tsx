import Image from 'next/image';
import Sidebar from '@/components/layouts/sidebar';
import Content from '@/components/app/dashboard';
import Logo from 'public/img/logo.png';

export default function Home() {
  return (
    <div>
      <Content />
    </div>
  );
}
