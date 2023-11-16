import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputNumberNoLProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  containerCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
};

const InputNumberNoL: React.FC<InputNumberNoLProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
  mandatory,
  containerCN,
  inputWrapperCN,
  inputCN,
  ...props
}) => {
  const { register } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
  };

  return (
    <div className={cn('relative', containerCN)}>
      {/* <label htmlFor={id || name} className='mb-1 inline-block'>
        {label || startCase(name)}
        {mandatory && <span className='text-[#f00]'>*</span>}
      </label> */}

      <div
        className={cn(
          'relative flex w-[300px] items-center overflow-hidden rounded-md border border-graySecondary/70 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary',
          inputWrapperCN
        )}
      >
        <input
          {...register(name)}
          type="number"
          value={field.value ?? ''}
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
          onChange={onChange}
          onWheelCapture={(e) => {
            //! disable scroll onChange
            e.currentTarget.blur();
          }}
          {...props}
        />
      </div>
      {error?.message && (
        <p className="text-xs tracking-wide text-red-600 dark:text-white">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputNumberNoL;
