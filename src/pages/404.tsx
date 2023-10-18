import React from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';

export default function CustomError() {
  const router = useRouter();

  return (
    <div className="mt-20 grid items-center justify-center">
      <h1 className="mb-20 text-center text-5xl">404 Error</h1>

      <div>
        Sorry, Please <Button onClick={() => router.back()}>Back </Button>
      </div>
    </div>
  );
}
