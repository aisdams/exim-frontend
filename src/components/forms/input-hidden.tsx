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
};

const InputHidden: React.FC<InputHiddenProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
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

  const [shouldUpdateValue, setShouldUpdateValue] = useState(false);
  const { setValue } = useFormContext();
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (shouldUpdateValue) {
      setValue(name, newValue);
      setShouldUpdateValue(false);
    }
  }, [shouldUpdateValue, newValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultCase) {
      field.onChange(e.target.value);
      return;
    }

    //! UpperCase Logic
    const { selectionStart, selectionEnd } = e.target;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(selectionStart, selectionEnd);

    setShouldUpdateValue(true);
    setNewValue(e.target.value);
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    hiddenFileInput.current?.click();
    console.log(hiddenFileInput.current);
    console.log('Clicked!');
  };

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
          type="hidden"
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
        <p className="text-xs tracking-wide text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputHidden;
