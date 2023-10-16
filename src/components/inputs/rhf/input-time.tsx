// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';

import { lowerCase, startCase } from 'lodash';
import { Clock, X } from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type InputTimeProps = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  withLabel?: boolean;
  additionalOnClear?: () => void;
  labelCN?: string;
  inputCN?: string;
};

const InputTime: React.FC<InputTimeProps> = ({
  label,
  name,
  id,
  placeholder,
  disabled,
  withLabel = true,
  mandatory,
  additionalOnClear = () => {},
  labelCN,
  inputCN,
}) => {
  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const onChange = (_dates: Date[], time: string) => {
    field.onChange(time);
  };

  return (
    <div className="">
      {withLabel && (
        <label
          htmlFor={id || name}
          className={cn('mb-1 inline-block', labelCN)}
        >
          {label || startCase(name)}
          {mandatory && <span className="text-[#f00]">*</span>}
        </label>
      )}

      <div className="relative">
        <Flatpickr
          ref={field.ref}
          name={field.name}
          options={{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            disableMobile: true,
          }}
          value={field.value ?? ''}
          id={id || name}
          className={cn(
            'input-time flex h-9 w-full rounded-md border border-input bg-background py-1 pl-7 pr-2 text-sm font-normal shadow-sm transition-colors placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
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
        />

        {/* TIME ICON */}
        <Clock
          size={14}
          className="absolute left-[.6rem] top-[50%] translate-y-[-50%] text-muted-foreground"
        />

        {/* CLEAR ICON */}
        {field.value && !disabled && (
          <div className="absolute right-[.3rem] top-[50%] grid h-full shrink-0 translate-y-[-50%] place-items-center">
            <button
              type="button"
              className="rounded-md p-1 opacity-50 hover:bg-grayish/50"
              onClick={() => {
                setValue(name, '', {
                  shouldValidate: true,
                });
                additionalOnClear();
              }}
            >
              <X size={16} className=" " />
            </button>
          </div>
        )}
      </div>

      {error?.message && (
        <p className="text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputTime;
