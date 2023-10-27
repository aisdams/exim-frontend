import { useEffect, useRef, useState } from 'react';
import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputHiddenProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultCase?: boolean;
  value?: string | number;
  withLabel?: boolean;
  containerCN?: string;
  labelCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  noErrorMessage?: boolean;
  onTouched?: () => void;
};

const InputHidden: React.FC<InputHiddenProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
  defaultCase,
  value,
  withLabel = true,
  containerCN,
  labelCN,
  inputWrapperCN,
  inputCN,
  noErrorMessage,
  onTouched,
  ...props
}) => {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    if (value !== undefined) {
      setValue(name, value);
    }
  }, [name, value, setValue]);

  const handleBlur = () => {
    if (onTouched) {
      onTouched();
    }
  };
  return (
    <div className={cn('relative', containerCN)}>
      <input
        type="hidden"
        {...register(name)}
        value={value}
        id={id || name}
        className={cn(
          'h-9 w-full bg-background px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:bg-slate-200 dark:disabled:bg-slate-800',
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
      />
    </div>
  );
};

export default InputHidden;
