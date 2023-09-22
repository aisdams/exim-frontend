import InputText from '@/components/forms/input-text';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command } from 'lucide-react';
import React from 'react';

export default function create() {
  return (
    <div>
      <div className="flex">
        <Command />
        <h1>Data Consolidation</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-sm dark:bg-graySecondary/70">
          <div className="bg-blueHeaderCard w-full">
            <div className="flex">
              <Command />
              <h1>Data JOC</h1>
            </div>

            <div className="grid">
              <div className="flex">
                <Label>#No JOC</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>JOC Date</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>Type</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>No. MBL</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>Vessel</Label>
                <InputText name="vessel" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-sm dark:bg-graySecondary/70">
          <div className="bg-blueHeaderCard w-full">
            <div className="flex">
              <Command />
              <h1>Data Consolidation</h1>
            </div>
            <div className="grid">
              <div className="flex">
                <Label>Agent :</Label>
                <InputText name="agent" />
              </div>
              <div className="flex">
                <Label>Loading :</Label>
                <InputText name="joc_no" />
              </div>
              <div className="flex">
                <Label>Discharge :</Label>
                <InputText name="type" />
              </div>
              <div className="flex">
                <Label>ETD :</Label>
                <InputText name="etd" />
              </div>
              <div className="flex">
                <Label>ETA</Label>
                <InputText name="eta" />
              </div>
              <div className="flex">
                <Label>No. Container</Label>
                <InputText name="eta" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button className="bg-green-600">Save</Button>
      <Button>Back</Button>
    </div>
  );
}
