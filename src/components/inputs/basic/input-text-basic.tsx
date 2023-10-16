import { forwardRef, RefObject } from 'react';
import { lowerCase, startCase } from 'lodash';

import { cn } from '@/lib/utils';

type InputTextBasicProps = {
  ref?: RefObject<HTMLInputElement>;
  label?: string;
  name?: string;
  id?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  containerCN?: string;
  labelCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  noLabel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputTextBasic = forwardRef<HTMLInputElement, InputTextBasicProps>(
  (
    {
      label,
      name,
      id,
      value,
      onChange,
      placeholder,
      disabled,
      mandatory,
      containerCN,
      labelCN,
      inputWrapperCN,
      inputCN,
      noLabel,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', containerCN)}>
        {!noLabel && (
          <label
            htmlFor={id || name}
            className={cn('inline-blockr mb-1', labelCN)}
          >
            {label || startCase(name)}
            {mandatory && <span className='text-[#f00]'>*</span>}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-center overflow-hidden rounded-md border border-input focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary',
            inputWrapperCN
          )}
        >
          <input
            ref={ref}
            type='text'
            value={value}
            id={id || name}
            className={cn(
              'h-9 w-full bg-background px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal disabled:bg-muted',
              inputCN
            )}
            placeholder={
              !disabled
                ? placeholder ||
                  label ||
                  `Enter ${lowerCase(name)}...` ||
                  'Type something...'
                : undefined
            }
            disabled={disabled}
            onChange={onChange}
            onKeyDown={onKeyDown}
            {...props}
          />
        </div>
      </div>
    );
  }
);

export default InputTextBasic;
