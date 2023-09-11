import Image from 'next/image';
import Sidebar from '@/components/layouts/sidebar';
import Content from '@/components/app/dashboard/content';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <Content />
    </div>
  );
}
