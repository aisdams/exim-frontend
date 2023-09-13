import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function Index() {
  return (
    <div className="w-full ">
      <div className="rounded-xl border-graySecondary/50">
        <h1>Create Job Order</h1>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border-graySecondary/50 border-2 p-3">
            <Label>Example 1 :</Label>
            <Input name="example" />
            <Label>Example 2 :</Label>
            <Input name="example" />
            <Label>Example 3 :</Label>
            <Input name="example" />
          </div>

          <div className="rounded-lg border-graySecondary/50 border-2 p-3">
            <div>
              <Label>Example 1 :</Label>
              <Input name="example" />
              <Label>Example 2 :</Label>
              <Input name="example" />
              <Label>Example 3 :</Label>
              <Input name="example" />
            </div>
          </div>

          <Button className="bg-green-400 mt-3">Save</Button>
        </div>
        <hr />
      </div>
    </div>
  );
}
