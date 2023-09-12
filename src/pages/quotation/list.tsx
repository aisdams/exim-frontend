import React, { useState } from 'react';
import { Command, Search, PlusSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function List() {
  const [date, setDate] = React.useState<Date>();
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');

  return (
    <div className="w-full mt-10 text-sm">
      <div className="flex gap-3">
        <Command />
        <h1> Quotation</h1>
      </div>
      <div className="w-[1000px] rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3">
        <div className="flex gap-3 items-center mb-5">
          <Search className="w-4 h-4" />
          <h3> Filter Data</h3>
        </div>

        <div className="">
          <div className="flex items-center">
            <h3>Date : </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'w-max justify-start text-left font-normal bg-lightWhite',
                    !date && 'text-muted-foreground'
                  )}
                >
                  {date ? format(date, 'PPP') : <span>01-01-2023</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <h3 className="font-semibold">To : </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'w-max justify-start text-left font-normal bg-lightWhite',
                    !date && 'text-muted-foreground'
                  )}
                >
                  {date ? format(date, 'PPP') : <span>12-09-2023</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <h1>Status : </h1>
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                <SelectValue placeholder="Order by" className="" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectLabel>Order By</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                  <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <h3>Filter By : </h3>

            <div className="grid">
              <div className="flex gap-1">
                <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                  <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                    <SelectValue placeholder="Order by" className="" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      <SelectLabel>Order By</SelectLabel>
                      <SelectItem value="Quo No">Quo No</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                      <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  name=""
                  id=""
                  placeholder=""
                  className="border border-graySecondary rounded-md"
                />
              </div>

              <div className="flex gap-1 mt-2">
                <Select value={orderByThree} onValueChange={setOrderByThree}>
                  <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                    <SelectValue placeholder="Order by" className="" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      <SelectLabel>Order By</SelectLabel>
                      <SelectItem value="Quo No">Quo No</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                      <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  name=""
                  id=""
                  placeholder=""
                  className="border border-graySecondary rounded-md"
                />

                <Button
                  className={cn(
                    'justify-start text-left font-normal bg-blue-500 rounded-md h-7'
                  )}
                >
                  <Search className="w- 4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-graySecondary/50 mt-2 px-3 pt-3 h-max">
        <Link href="/quotation/create">
          <Button className="mb-5 bg-green-600 text-white w-max px-2 py-4 h-5 gap-2">
            <PlusSquare className="h-5" />
            <h3>Create Quotation</h3>
          </Button>
        </Link>
      </div>
    </div>
  );
}
