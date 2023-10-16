import { DatePickerInput, DateValue } from '@mantine/dates';
import { lowerCase, startCase } from 'lodash';
import { CalendarDays, X } from 'lucide-react';
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
      <label htmlFor={id || name} className='mb-1 inline-block'>
        {label || startCase(name)}
        {mandatory && <span className='text-[#f00]'>*</span>}
      </label>

      <div className='relative'>
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
          valueFormat='DD/MM/YYYY'
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

        {/* CALENDAR ICON */}
        <CalendarDays
          size={14}
          className='absolute left-[.6rem] top-[47%] translate-y-[-47%] text-muted-foreground'
        />

        {!noClear && field.value && !disabled && (
          <div className='absolute right-[.3rem] top-[50%] grid h-full shrink-0 translate-y-[-50%] place-items-center'>
            <button
              type='button'
              className='rounded-md p-1 opacity-50 hover:bg-grayish/50'
              onClick={() => {
                setValue(name, null, {
                  shouldValidate: true,
                });
                additionalOnClear();
              }}
            >
              <X size={16} className=' ' />
            </button>
          </div>
        )}
      </div>
      {error?.message && (
        <p className='text-xs text-red-600'>{error.message}</p>
      )}
    </div>
  );
};

export default InputDate;
