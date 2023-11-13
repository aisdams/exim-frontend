import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputTextAreaProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  containerCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const InputTextArea: React.FC<InputTextAreaProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
  mandatory,
  containerCN,
  inputWrapperCN,
  inputCN,
  onChange,
  ...props
}) => {
  const { register } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const internalOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <div className={cn('relative', containerCN)}>
      <label htmlFor={id || name} className="mb-1 inline-block">
        {label || startCase(name)}
        {mandatory && <span className="text-[#f00]">*</span>}
      </label>

      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-md border focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary',
          inputWrapperCN
        )}
      >
        <textarea
          {...register(name)}
          value={field.value}
          id={id || name}
          className={cn(
            'w-full bg-background p-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:bg-muted',
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
          rows={5}
          {...props}
        />
      </div>
      {error?.message && (
        <p className="text-xs tracking-wide text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputTextArea;
