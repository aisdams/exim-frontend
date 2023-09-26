import { useMemo, useRef, useState } from 'react';
import { useIsDark, useMounted } from '@/hooks';
import { Option } from '@/types';
import { debounce, lowerCase, startCase } from 'lodash';
import { X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import Select, { InputActionMeta } from 'react-select';
import makeAnimated from 'react-select/animated';

import { handleResetFieldAfterChange } from '@/lib/utils';

type InputSelectPaginationProps = {
  query?: any;
  options?: Option[];
  defaultValue?: string;
  optionLabel?: string;
  optionValue?: string;
  setSearchText: (value: string) => void;
  resetFieldAfterChange?: string[];
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
  portalTargetId?: string;
  valueAsNumber?: boolean;
  noPortal?: boolean;
  additionalOnChange?: (option: any) => void;
  additionalOnClear?: () => void;
};

const animatedComponents = makeAnimated();

const InputSelectPagination: React.FC<InputSelectPaginationProps> = ({
  query,
  options = [],
  defaultValue,
  optionLabel,
  optionValue,
  setSearchText,
  resetFieldAfterChange,
  isLoading,
  name,
  id,
  label,
  placeholder,
  mandatory,
  noClear,
  disabled,
  menuIsOpen = undefined,
  menuZIndex = 1,
  portalTargetId,
  valueAsNumber = false,
  noPortal = false,
  additionalOnChange = () => {},
  additionalOnClear = () => {},
  ...props
}) => {
  const mounted = useMounted();
  const { isDark } = useIsDark();
  const { register, setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const [inputValue, setInputValue] = useState('');

  const data = query?.data?.data;

  const selectedValue = useMemo(
    () =>
      data?.find(
        (item: any) =>
          String(item[optionValue || 'value']) === String(field.value)
      ),
    [data, options, field.value, optionValue]
  );

  const handleSearchDebounced = useRef(
    debounce((searchText) => setSearchText(searchText), 300)
  ).current;

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setInputValue(inputText);
      handleSearchDebounced(inputText);
    }
  };

  const onChange = (option: any) => {
    const oldValue = field.value;

    if (valueAsNumber) {
      setValue(name, Number(option[optionValue || 'value']), {
        shouldValidate: true,
      });
    } else {
      setValue(name, option[optionValue || 'value'], {
        shouldValidate: true,
      });
    }

    additionalOnChange(option);

    //! if oldValue not-equal newValue, do reset (optional)
    if (oldValue !== option[optionValue || 'value']) {
      handleResetFieldAfterChange({ resetFieldAfterChange, setValue });
    }
  };

  return (
    <div className=''>
      <div className=''>
        <label htmlFor={id || name} className='mb-1 inline-block'>
          {label || startCase(name)}
          {mandatory && <span className='text-[#f00]'>*</span>}
        </label>
        <div className='relative'>
          {mounted && (
            <Select
              {...register(name)}
              options={options.length > 0 ? options : query?.data?.data || []}
              isLoading={isLoading || query?.isFetching || false}
              defaultValue={defaultValue}
              inputValue={inputValue}
              value={field.value ? selectedValue : null}
              getOptionLabel={(option) => option[optionLabel || 'label']}
              getOptionValue={(option) => option[optionValue || 'value']}
              onInputChange={handleInputChange}
              onBlur={() => {
                //! reset search input 'onBlur'
                setInputValue('');
                setSearchText('');
                field.onBlur();
              }}
              onChange={onChange}
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
              className=''
              classNamePrefix='select'
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#7c3aed',
                  primary25: '#7c3aed',
                  neutral0: 'transparent',
                  neutral20: '#525255',
                  neutral80: 'white',
                },
              })}
              menuPortalTarget={
                noPortal
                  ? undefined
                  : portalTargetId
                  ? document.getElementById(portalTargetId)
                  : document.body
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: menuZIndex || 10 }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: '36px',
                  minHeight: 'auto',
                  backgroundColor: disabled
                    ? isDark
                      ? 'rgb(17 24 39 / 0.9)'
                      : 'rgb(17 24 39 / 0.1)'
                    : 'transparent',
                  border: state.isFocused
                    ? '1.5px solid hsl(var(--primary))'
                    : '1px solid hsl(var(--input))',
                  borderRadius: '0.375rem',
                  cursor: state.isDisabled ? 'not-allowed' : 'auto',
                  opacity: state.isDisabled ? '0.5' : '1',
                  pointerEvents: state.isDisabled ? 'auto' : 'auto',
                  '&:hover': {
                    color: state.isDisabled
                      ? 'hsl(var(--input))'
                      : 'hsl(0, 0%, 70%)',
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
                  paddingInline: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  borderRadius: '0.25rem',
                  color:
                    isSelected || isFocused
                      ? 'white'
                      : `${isDark ? '#FAFAFA' : 'black'}`,
                  '&:hover': {
                    backgroundColor: 'hsl(var(--primary))',
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
              {...props}
            />
          )}
          {!noClear && field.value && !disabled && (
            <button
              type='button'
              className='absolute right-[3rem] top-[50%] grid h-[20px] w-[20px] translate-y-[-50%] cursor-pointer place-items-center rounded-full bg-slate-400 text-sm transition-all hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-600'
              onClick={() => {
                setValue(name, valueAsNumber ? undefined : '', {
                  shouldValidate: true,
                });
                //! reset search
                setSearchText('');
                //! resetFieldAfterChange
                handleResetFieldAfterChange({
                  resetFieldAfterChange,
                  setValue,
                });
                additionalOnClear();
              }}
            >
              <X className='h-3 w-3 text-black' />
            </button>
          )}
        </div>
      </div>
      {error?.message && (
        <p className='text-xs tracking-wide text-red-600'>{error.message}</p>
      )}
    </div>
  );
};

export default InputSelectPagination;
