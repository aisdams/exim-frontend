import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputTextProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  defaultCase?: boolean;
  value?: string | number;
  withLabel?: boolean;
  containerCN?: string;
  labelCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  noErrorMessage?: boolean;
};

const InputText: React.FC<InputTextProps> = ({
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

  return (
    <div className={cn('relative', containerCN)}>
      {/* {withLabel && (
        <label
          htmlFor={id || name}
          className={cn('mb-1 inline-block', labelCN)}
        >
          {label || startCase(name)}
          {mandatory && <span className="text-[#f00]">*</span>}
        </label>
      )} */}

      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-md border border-graySecondary/70 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary w-[300px]',
          inputWrapperCN
        )}
      >
        <input
          {...register(name)}
          type="text"
          value={field.value ?? ''}
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
          onChange={onChange}
          {...props}
        />
      </div>
      {!noErrorMessage && error?.message && (
        <p className="text-xs tracking-wide text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputText;
