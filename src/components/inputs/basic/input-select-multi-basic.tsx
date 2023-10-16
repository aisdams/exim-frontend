import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
// import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';

type AnyKeyObj = { [key: string]: any };

type InputSelectMultiBasicProps = {
  selected: AnyKeyObj[];
  setSelected: (value: AnyKeyObj) => void;
  options: any[];
  optionValue?: string;
  optionLabel?: string;
  customLabel?: (option: AnyKeyObj) => string;
  placeholder?: string;
  disabled?: boolean;
  containerCN?: string;
};

export const InputSelectMultiBasic: React.FC<InputSelectMultiBasicProps> = ({
  selected,
  setSelected,
  customLabel,
  options,
  optionValue = 'value',
  optionLabel = 'label',
  placeholder,
  disabled,
  containerCN,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  // const [selected, setSelected] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = React.useCallback((option: any) => {
    setSelected((prev: AnyKeyObj[]) =>
      prev.filter((s) => s[optionValue] !== option[optionValue])
    );
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev: AnyKeyObj[]) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = options.filter((option) => !selected.includes(option));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn('overflow-visible bg-transparent', containerCN)}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(
          'group grid min-h-[39px] items-center rounded-md border border-input text-sm hover:cursor-text',
          disabled && 'bg-muted'
        )}
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        <div className="flex h-full flex-wrap gap-1 px-3 py-2">
          {selected.map((option) => {
            return (
              // Badge Variant {variant="secondary"}
              <div key={option[optionValue]}>
                {customLabel ? customLabel(option) : option[optionLabel]}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={
              !disabled ? placeholder || 'Select options...' : undefined
            }
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
              selected.length > 0 && 'ml-2'
            )}
          />
        </div>
      </div>
      <div className="relative">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 z-10 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option[optionValue]}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue('');
                      setSelected((prev: AnyKeyObj[]) => [...prev, option]);
                    }}
                    className="cursor-pointer"
                  >
                    {option[optionLabel]}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};
