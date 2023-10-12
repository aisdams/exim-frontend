import { lowerCase, startCase } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputDisableProps = {
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

const InputDisable: React.FC<InputDisableProps> = ({
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

  let inputValue = field.value ?? '';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultCase) {
      inputValue = e.target.value;
      field.onChange(e.target.value);
      return;
    }

    //! UpperCase Logic
    const { selectionStart, selectionEnd } = e.target;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(selectionStart, selectionEnd);

    inputValue = e.target.value;
    field.onChange(e.target.value);
  };

  return (
    <div className={cn('relative', containerCN)}>
      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-md border border-graySecondary/70 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary w-full',
          inputWrapperCN
        )}
      >
        <input
          {...register(name)}
          type="text"
          value={inputValue}
          id={id || name}
          className={cn(
            'h-9 w-full bg-[#111522] px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted cursor-not-allowed',
            inputCN
          )}
          placeholder={
            placeholder ||
            label ||
            `Enter ${lowerCase(name)}...` ||
            'Type something...'
          }
          readOnly
          onChange={onChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputDisable;
