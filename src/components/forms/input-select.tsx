import React from 'react';
import { useIsDark, useMounted } from '@/hooks';
import { Option } from '@/types';
import { lowerCase, startCase } from 'lodash';
import { X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type InputSelectProps = {
  options?: Option[];
  defaultValue?: string;
  optionLabel?: string;
  optionValue?: string;
  isLoading?: boolean;
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  mandatory?: boolean;
  noClear?: boolean;
  disabled?: boolean;
  menuZIndex?: number;
  menuIsOpen?: boolean | undefined;
  noPortal?: boolean;
  additionalOnChange?: (option: any) => void;
  additionalOnClear?: () => void;
};

const InputSelect: React.FC<InputSelectProps> = ({
  options = [],
  defaultValue,
  optionLabel = 'label',
  optionValue = 'value',
  isLoading,
  name,
  id,
  label,
  placeholder,
  mandatory,
  noClear,
  disabled,
  menuZIndex = 1,
  menuIsOpen = undefined,
  noPortal = false,
  additionalOnChange = () => {},
  additionalOnClear = () => {},
}) => {
  const mounted = useMounted();
  const { isDark } = useIsDark();
  const { register, setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const selectedValue = options?.find(
    (option: any) => String(option[optionValue]) === String(field.value)
  );

  const onChange = (option: any) => {
    setValue(name, option[optionValue || 'value'], {
      shouldValidate: true,
    });
    additionalOnChange(option);
  };

  return (
    <div className="">
      <div className="">
        {/* <label htmlFor={id || name} className="mb-1 inline-block">
          {label || startCase(name)}
          {mandatory && <span className="text-[#f00]">*</span>}
        </label> */}
        <div className="relative">
          {mounted && (
            <Select
              {...register(name)}
              options={options || []}
              defaultValue={defaultValue}
              value={field.value ? selectedValue : null}
              getOptionLabel={(option: any) => option[optionLabel]}
              getOptionValue={(option: any) => option[optionValue]}
              onChange={onChange}
              isLoading={isLoading}
              isDisabled={disabled}
              name={name}
              id={id || name}
              instanceId={id || name}
              placeholder={
                !disabled
                  ? placeholder ||
                    label ||
                    `Enter ${lowerCase(name)}...` ||
                    'Type something...'
                  : null
              }
              components={animatedComponents}
              className="!w-[300px] dark:bg-black bg-transparent border border-muted-foreground dark:border-none rounded-md"
              classNamePrefix="select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: 'hsl(var(--primary))',
                  primary25: '#4783b7',
                  neutral0: 'transparent',
                  neutral20: '#525255',
                  neutral80: 'white',
                },
              })}
              menuPortalTarget={noPortal ? undefined : document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 999 || 10 }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: '36px',
                  minHeight: 'auto',
                  backgroundColor: 'transparent',
                  border: state.isFocused
                    ? '1.5px solid hsl(var(--primary))'
                    : '1px solid hsl(var(--input))',
                  borderRadius: '0.375rem',
                  cursor: state.isDisabled ? 'not-allowed' : 'auto',
                  opacity: state.isDisabled ? '0.5' : '1',
                  pointerEvents: state.isDisabled ? 'auto' : 'auto',
                  '&:hover': {
                    color: state.isDisabled ? '#fff' : '#fff',
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  overflow: 'hidden',
                  border: isDark
                    ? '1px solid hsl(var(--border))'
                    : '0px solid hsl(var(--border))',
                  borderRadius: '0.375rem',
                  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                }),
                menuList: (provided) => ({
                  ...provided,
                  backgroundColor: 'hsl(var(--background))',
                  padding: '0.25rem',
                }),
                option: (provided, { isSelected, isFocused }) => ({
                  ...provided,
                  padding: 0,
                  paddingBlock: '0.4rem',
                  zIndex: 40,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  borderRadius: '0.25rem',
                  color:
                    isSelected || isFocused
                      ? 'white'
                      : `${isDark ? '#fff' : 'black'}`,
                  '&:hover': {
                    backgroundColor: 'dark:#000',
                    color: 'white',
                  },
                }),
                placeholder: (provided) => ({
                  ...provided,
                  fontWeight: 400,
                  color: 'hsl(var(--muted-foreground))',
                }),
                input: (provided) => ({
                  ...provided,
                  fontWeight: 400,
                  color: 'hsl(var(--foreground))',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'hsl(var(--foreground))',
                }),
                dropdownIndicator: (provided, { selectProps }) => ({
                  ...provided,
                  color: 'hsl(var(--muted-foreground))',
                  '&:hover': {
                    color: 'hsl(var(--muted-foreground))',
                  },
                  transitionProperty: 'transform',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDuration: '300ms',
                  transform: selectProps.menuIsOpen
                    ? 'rotate(180deg)'
                    : undefined,
                }),
              }}
              maxMenuHeight={165}
              menuIsOpen={menuIsOpen}
            />
          )}
          {!noClear && field.value && !disabled && (
            <button
              type="button"
              className="absolute right-[3rem] top-[50%] grid h-[20px] w-[20px] translate-y-[-50%] cursor-pointer place-items-center rounded-full bg-slate-400 text-sm transition-all hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-600"
              onClick={() => {
                setValue(name, '', {
                  shouldValidate: true,
                });
                additionalOnClear();
              }}
            >
              <X className="h-3 w-3 text-black" />
            </button>
          )}
        </div>
      </div>
      {error?.message && (
        <p className="text-xs tracking-wide text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputSelect;
