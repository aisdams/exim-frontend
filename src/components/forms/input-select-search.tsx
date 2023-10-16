import { useIsDark, useMounted } from '@/hooks';
import { Option } from '@/types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type InputSelectSearchProps = {
  options?: Option[];
  defaultValue?: string;
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const InputSelectSearch: React.FC<InputSelectSearchProps> = ({
  options = [],
  defaultValue,
  value,
  setValue,
  // optionLabel,
  // optionValue,
  isLoading,
  name,
  id,
  label,
  placeholder,
  // mandatory,
  // noClear,
  disabled,
  // additionalOnChange = () => {},
  // additionalOnClear = () => {},
}) => {
  const { isDark } = useIsDark();
  const mounted = useMounted();

  const selectedValue = options?.find(
    (option) => String(option.value) === String(value)
  );

  return (
    <div className="rounded-r-lg border border-slate-200 transition-[background-color] hover:bg-slate-400/10 peer-focus:border-purple-600 dark:border-slate-800">
      <div className="relative h-full">
        {mounted && (
          <Select
            options={options || []}
            defaultValue={defaultValue || ' '}
            value={value ? selectedValue : null}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            onChange={(option: any) => setValue(option.value)}
            isLoading={isLoading}
            isSearchable={false}
            name={name}
            id={id || name}
            instanceId={id || name}
            placeholder={!disabled ? placeholder || label || 'Choose...' : null}
            components={animatedComponents}
            className=""
            classNamePrefix="select"
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
            menuPortalTarget={document.body}
            styles={{
              container: (
                provided
                // , { selectProps }
              ) => {
                return {
                  ...provided,
                  height: '100%',
                  // width: selectProps?.value?.label.length
                  //   ? `${selectProps.value.label.length + 5}ch`
                  //   : 'auto',
                };
              },
              menuPortal: (provided) => ({ ...provided, zIndex: 10 }),
              control: (provided) => ({
                ...provided,
                borderWidth: '0px',
                borderRadius: '0',
                boxShadow: 'none',
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 2,
                borderRadius: '0.5rem',
                overflow: 'hidden',
              }),
              menuList: (provided) => ({
                ...provided,
                backgroundColor: isDark ? 'rgb(30 41 59)' : 'white',
                borderWidth: '0px',
                padding: 0,
                boxShadow:
                  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              }),
              option: (provided, { isSelected, isFocused }) => ({
                ...provided,
                fontSize: '0.875rem',
                color:
                  isSelected || isFocused
                    ? 'white'
                    : `${isDark ? 'rgb(148 163 184)' : 'black'}`,
                '&:hover': {
                  backgroundColor: '#7c3aed',
                  color: 'white',
                },
              }),
              valueContainer: (provided) => {
                return {
                  ...provided,
                  paddingRight: 0,
                };
              },
              singleValue: (
                provided
                // { selectProps }
              ) => ({
                ...provided,
                color: isDark ? 'white' : 'black',
                // width: selectProps?.value?.label.length
                //   ? `${selectProps.value.label.length + 1.5}ch`
                //   : 'auto',
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              dropdownIndicator: (provided, { selectProps }) => ({
                ...provided,
                color: isDark ? 'white' : 'black',
                '&:hover': {
                  color: isDark ? 'white' : 'black',
                },
                transitionProperty:
                  'color, background-color, border-color,  outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '300ms',
                transform: selectProps.menuIsOpen
                  ? 'rotate(180deg)'
                  : undefined,
              }),
            }}
            maxMenuHeight={165}
            // menuIsOpen
          />
        )}
      </div>
    </div>
  );
};

export default InputSelectSearch;
