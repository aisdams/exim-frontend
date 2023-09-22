import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command } from 'lucide-react';
import React from 'react';

export default function create() {
  return (
    <div className="grid grid-cols-2">
      <div className="border border-graySecondary rounded-md">
        <div className="flex w-full bg-blueHeaderCard">
          <Command />
          <h1>Data Order</h1>
        </div>

        <div className="">
          <div>
            <Label>#No JO</Label>
            <Input name="" />
          </div>
          <div>
            <Label>JO Date</Label>
            <Input name="" />
          </div>
          <div>
            <Label>Type</Label>
            <Input name="" />
          </div>
          <div>
            <Label>Customer</Label>
            <Input name="" />
          </div>
        </div>
      </div>
      <div className="border border-graySecondary rounded-md">
        <div className="flex w-full bg-blueHeaderCard">
          <Command />
          <h1>Data Quotation</h1>
        </div>
        <div className="">
          <div className="">
            <Label>JO NO</Label>
            <Input name="" />
          </div>
          <div className="">
            <Label>Lorem</Label>
            <Input name="" />
          </div>
        </div>
      </div>
    </div>
  );
}
