import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import React from 'react';

export default function CustomError() {
  const router = useRouter();

  return (
    <div className="grid justify-center items-center mt-20">
      <h1 className="text-center mb-20 text-5xl">404 Error</h1>
      <span>
        Sorry, Please <Button onClick={() => router.back()}>Back </Button>
      </span>
    </div>
  );
}
