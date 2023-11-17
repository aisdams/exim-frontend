import React from 'react';
import { lowerCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { cn } from '@/lib/utils';

type InputMultiTextProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  defaultCase?: boolean;
  value?: string[] | number[];
  withLabel?: boolean;
  containerCN?: string;
  labelCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  noErrorMessage?: boolean;
  onTouched?: () => void;
  control?: any;
};

const InputMultiText: React.FC<InputMultiTextProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
  mandatory,
  defaultCase,
  withLabel = true,
  containerCN,
  labelCN,
  inputWrapperCN,
  inputCN,
  noErrorMessage,
  onTouched,
  value,
  ...props
}) => {
  const { register } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const convertInputStringToArray = (inputString: string): string[] => {
    try {
      const parsedArray = JSON.parse(inputString);
      if (
        Array.isArray(parsedArray) &&
        parsedArray.every((item) => typeof item === 'string')
      ) {
        return parsedArray;
      }
    } catch (error) {
      toast.error('Input tidak dalam format yang valid');
    }
    return [];
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValues = e.target.value;
    const valueArray = convertInputStringToArray(inputValues);

    field.onChange(valueArray);
  };

  const handleBlur = () => {
    if (onTouched) {
      onTouched();
    }
  };

  const displayValue = Array.isArray(value) ? JSON.stringify(value) : value;

  return (
    <div className={cn('relative', containerCN)}>
      <div
        className={cn(
          'relative flex w-[300px] items-center overflow-hidden rounded-md border border-graySecondary/70 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary',
          inputWrapperCN
        )}
      >
        <input
          {...register(name)}
          type="text"
          value={displayValue || ''}
          id={id || name}
          className={cn(
            'h-9 w-full bg-background px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted',
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
          onBlur={handleBlur}
          onChange={onChange}
          {...props}
        />
      </div>
      {!noErrorMessage && error?.message && (
        <p className="text-white-600 text-xs tracking-wide">
          {error.message} !
        </p>
      )}
    </div>
  );
};

export default InputMultiText;
