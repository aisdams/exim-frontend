import React from 'react';
import { Loader } from '@mantine/core';

const CheckAuthSplash = () => {
  return (
    <div className='grid min-h-screen place-items-center bg-background'>
      <Loader variant='bars' color='violet' size='xl' />
    </div>
  );
};

export default CheckAuthSplash;
