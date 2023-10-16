import React from 'react';
import { lowerCase, startCase } from 'lodash';
import { ChevronDown, X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ComboboxProps<T> = {
  options: T[];
  inputValue?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  optionValue?: string;
  optionLabel?: string;
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  mandatory?: boolean;
  disabled?: boolean;
  additionalOnChange?: (option: T) => void;
  additionalOnClear?: () => void;
  getSelectedOptionLabel?: (option: T) => string | false | undefined;
};

export default function Combobox<T>({
  options = [],
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
  additionalOnChange = () => {},
  additionalOnClear = () => {},
  getSelectedOptionLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);

  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const selectedOption = options.find(
    // @ts-expect-error
    (option) => option[optionValue] === field.value
  );

  // @ts-expect-error
  const selectedOptionLabel = () => getSelectedOptionLabel?.(selectedOption);

  const handleBlur = () => {
    setInputValue?.('');
  };

  const onChange = (option: any) => {
    //! if value the same, reset.
    if (option[optionValue] === field.value) {
      setValue(name, null, { shouldValidate: true });
      additionalOnClear?.();
    } else {
      //! set value
      setValue(name, option[optionValue], { shouldValidate: true });
    }
    setInputValue?.('');
    additionalOnChange(option);
    setOpen(false);
  };

  const onClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setValue(name, null, { shouldValidate: true });
    additionalOnClear();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className=''>
        <label htmlFor={id || name} className='mb-1 inline-block'>
          {label || startCase(name)}
          {mandatory && <span className='text-[#f00]'>*</span>}
        </label>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            ref={(node) => {
              field.ref(node);
              if (node) setTriggerWidth(node.offsetWidth);
            }}
            role='combobox'
            aria-expanded={open}
            className='group relative block w-full overflow-hidden px-2 font-normal hover:bg-accent disabled:bg-muted disabled:opacity-100 data-[state=open]:border-transparent data-[state=open]:ring-2 data-[state=open]:ring-primary'
            disabled={disabled}
          >
            {/* Value / Placeholder */}
            <span
              className={cn(
                'block truncate pr-10 text-start ',
                !(field.value && selectedOption) &&
                  'font-normal text-muted-foreground'
              )}
            >
              {field.value && selectedOption
                ? // @ts-expect-error
                  selectedOptionLabel() || selectedOption[optionLabel]
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
              {field.value && (
                <div className='grid h-full shrink-0 place-items-center'>
                  <button
                    type='button'
                    className='rounded-md p-1 opacity-50 hover:bg-grayish/50'
                    onClick={onClear}
                  >
                    <X size={16} className=' ' />
                  </button>
                </div>
              )}
              <div className='grid h-full place-items-center px-2'>
                <ChevronDown size={16} className='shrink-0 opacity-50' />
              </div>
            </div>
          </Button>
        </PopoverTrigger>

        {/* Error Message */}
        {error?.message && (
          <p className='text-xs text-red-600'>{error.message}</p>
        )}
      </div>
      <PopoverContent
        align='start'
        // className='w-auto max-w-[22rem] p-0 xl:max-w-none' //! old way
        className='p-0'
        style={{ width: triggerWidth || undefined }} //! hack: width follows the trigger width
      >
        <Command>
          <CommandInput
            placeholder='Search option...'
            value={inputValue}
            onValueChange={
              setInputValue ? (search) => setInputValue(search) : undefined
            }
            onBlur={handleBlur}
            className={cn('font-normal')}
          />
          <CommandList className='max-h-60 w-full overflow-y-auto p-1'>
            <CommandEmpty>No option found.</CommandEmpty>

            {/* Option Component */}
            {options.map((option) => (
              <CommandItem
                // @ts-expect-error
                key={option[optionValue]}
                // @ts-expect-error
                value={option[optionLabel]}
                onSelect={() => onChange(option)}
                className={cn(
                  // @ts-expect-error
                  field.value === option[optionValue] &&
                    'bg-primary text-primary-foreground aria-selected:bg-primary/90 aria-selected:text-primary-foreground'
                )}
              >
                {/* @ts-expect-error */}
                {getSelectedOptionLabel?.(option) || option[optionLabel]}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
