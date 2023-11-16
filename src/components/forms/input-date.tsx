import { DatePickerInput, DateValue } from '@mantine/dates';
import { lowerCase, startCase } from 'lodash';
import { X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

type InputDateProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  noClear?: boolean;
  disabled?: boolean;
  mandatory?: boolean;
  additionalOnClear?: () => void;
  convertToString?: boolean;
};

const InputDate: React.FC<InputDateProps> = ({
  label,
  name,
  id,
  placeholder,
  noClear = false,
  disabled = false,
  mandatory = false,
  additionalOnClear = () => {},
  convertToString,
}) => {
  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const onChange = (value: DateValue) => {
    field.onChange(convertToString ? value?.toISOString() : value);
  };

  return (
    <div>
      {/* <label htmlFor={id || name} className="mb-1 inline-block">
        {label || startCase(name)}
        {mandatory && <span className="text-[#f00]">*</span>}
      </label> */}

      <div className="relative w-[300px]">
        <DatePickerInput
          ref={field.ref}
          value={
            field.value
              ? convertToString
                ? new Date(field.value)
                : field.value
              : null
          }
          onBlur={field.onBlur}
          onChange={onChange}
          className="disabled:bg-blue-300 [&_.mantine-Popover-dropdown]:bg-red-500"
          // styles={{
          //   placeholder: {
          //     fontWeight: 'normal',
          //     color: 'hsl(var(--muted-foreground)) !important',
          //   },
          // }}
          valueFormat="DD/MM/YYYY"
          placeholder={
            !disabled
              ? placeholder ||
                label ||
                `Enter ${lowerCase(name)}...` ||
                'Type something...'
              : undefined
          }
          disabled={disabled}
        />

        {!noClear && field.value && !disabled && (
          <button
            type="button"
            className="absolute right-[.6rem] top-[50%] grid h-[20px] w-[20px] translate-y-[-50%] cursor-pointer place-items-center rounded-full bg-slate-400 text-sm transition-all hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-600"
            onClick={() => {
              setValue(name, undefined, {
                shouldValidate: true,
              });
              additionalOnClear();
            }}
          >
            <X className="h-3 w-3 text-black" />
          </button>
        )}
      </div>
      {error?.message && (
        <p className="text-xs tracking-wide text-red-600 dark:text-white">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputDate;
