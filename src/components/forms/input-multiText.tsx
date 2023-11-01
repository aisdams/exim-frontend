import React from 'react';
import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultCase) {
      field.onChange(e.target.value);
      return;
    }

    //! UpperCase Logic
    const { selectionStart, selectionEnd } = e.target;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(selectionStart, selectionEnd);

    field.onChange(e.target.value);
  };

  const handleBlur = () => {
    if (onTouched) {
      onTouched();
    }
  };

  const displayValue = Array.isArray(value) ? value.join(', ') : value;

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
          value={field.value ?? (displayValue || '')}
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
