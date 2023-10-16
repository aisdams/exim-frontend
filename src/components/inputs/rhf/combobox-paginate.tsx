import React, { useEffect, useMemo } from 'react';
import { Res } from '@/types';
import { Loader } from '@mantine/core';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { lowerCase, startCase } from 'lodash';
import { ChevronDown, X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ComboboxPaginateProps = {
  query: UseInfiniteQueryResult<Res<any[]>, unknown>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  optionValue?: string;
  optionLabel?: string;
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  mandatory?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  additionalOnChange?: (option: any) => void;
  additionalOnClear?: () => void;
};

export default function ComboboxPaginate({
  query,
  inputValue,
  setInputValue,
  optionValue = 'value',
  optionLabel = 'label',
  name,
  id,
  label,
  placeholder,
  mandatory,
  disabled,
  clearable = true,
  additionalOnChange = () => {},
  additionalOnClear = () => {},
}: ComboboxPaginateProps) {
  const [open, setOpen] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);

  const options = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) || [],
    [query.data]
  );

  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const handleBlur = () => {
    setInputValue('');
  };

  const onChange = (option: any) => {
    //! if value the same, reset.
    if (option[optionValue] === field.value) {
      setValue(name, '', { shouldValidate: true });
      additionalOnClear?.();
    } else {
      //! set value
      setValue(name, option[optionValue], { shouldValidate: true });
    }
    setInputValue('');
    additionalOnChange(option);
    setOpen(false);
  };

  const onClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setValue(name, '', { shouldValidate: true });
    additionalOnClear();
    setOpen(false);
  };

  //! Infinite scroll logic
  const { ref: infiniteRef, inView } = useInView();
  useEffect(() => {
    if (inView && query.hasNextPage && !field.value) {
      query.fetchNextPage();
    }
  }, [inView]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="">
        <label htmlFor={id || name} className="mb-1 inline-block">
          {label || startCase(name)}
          {mandatory && <span className="text-[#f00]">*</span>}
        </label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            ref={(node) => {
              field.ref(node);
              if (node) setTriggerWidth(node.offsetWidth);
            }}
            role="combobox"
            aria-expanded={open}
            className="group relative block w-full overflow-hidden px-2 font-normal hover:bg-accent disabled:bg-muted disabled:opacity-100 data-[state=open]:border-transparent data-[state=open]:ring-2 data-[state=open]:ring-primary"
            disabled={disabled}
          >
            {/* Value / Placeholder */}
            <span
              className={cn(
                'block truncate pr-10 text-start ',
                !(field.value && options) && 'font-normal text-muted-foreground'
              )}
            >
              {field.value && options && options.length > 0
                ? options[0][optionLabel]
                : !disabled //! placeholder
                ? placeholder || label || name
                  ? `Select ${lowerCase(label || name)}...`
                  : 'Select Option...'
                : undefined}
            </span>

            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center bg-background transition-colors group-hover:bg-accent',
                disabled && 'bg-muted'
              )}
            >
              {clearable && field.value && (
                <div className="grid h-full shrink-0 place-items-center">
                  <button
                    type="button"
                    className="rounded-md p-1 opacity-50 hover:bg-grayish/50"
                    onClick={onClear}
                  >
                    <X size={16} className=" " />
                  </button>
                </div>
              )}
              <div className="grid h-full place-items-center px-2">
                <ChevronDown size={16} className="shrink-0 opacity-50" />
              </div>
            </div>
          </Button>
        </PopoverTrigger>

        {/* Error Message */}
        {error?.message && (
          <p className="text-xs text-red-600">{error.message}</p>
        )}
      </div>
      <PopoverContent
        align="start"
        // className='w-auto max-w-[22rem] p-0 xl:max-w-none' //! old way
        className="p-0"
        style={{ width: triggerWidth || undefined }} //! hack: width follows the trigger width
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search option..."
            value={inputValue}
            onValueChange={(search) => setInputValue(search)}
            onBlur={handleBlur}
            disabled={field.value}
            // containerCN={cn(field.value && 'hidden')}
            className={cn('font-normal')}
          />
          <CommandList className="max-h-60 w-full overflow-y-auto p-1">
            {query.isLoading ? (
              //! Loader Component
              <div className="p-1">
                <Loader type="dots" color="gray" className="mx-auto py-2.5" />
              </div>
            ) : query.isError ? (
              //! Error Component
              <div className="py-6 text-center text-sm">
                Error, something went wrong
              </div>
            ) : options.length < 1 ? (
              //! Empty Component
              <div className="py-6 text-center text-sm">No option found.</div>
            ) : (
              //! Option Component
              options.map((option) => (
                <CommandItem
                  key={option[optionValue]}
                  value={option[optionValue]}
                  onSelect={() => onChange(option)}
                  className={cn(
                    field.value === option[optionValue] &&
                      'bg-primary text-primary-foreground aria-selected:bg-primary/90 aria-selected:text-primary-foreground'
                  )}
                >
                  {option[optionLabel]}
                </CommandItem>
              ))
            )}

            {/* Infinite scroll trigger */}
            <div
              ref={infiniteRef}
              className="w-full text-center text-muted-foreground"
            >
              {query.isFetchingNextPage ? (
                <Loader type="dots" color="gray" className="mx-auto py-2.5" />
              ) : query.hasNextPage && !field.value ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();

                    query.fetchNextPage();
                  }}
                  disabled={!query.hasNextPage || query.isFetchingNextPage}
                >
                  Load more options
                </Button>
              ) : null}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
