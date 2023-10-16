// import { FileInput } from '@mantine/core';
// import { lowerCase, startCase } from 'lodash';
// import { X } from 'lucide-react';
// import { useController, useFormContext } from 'react-hook-form';

// import { cn } from '@/lib/utils';
// import { ImageValueComponent } from '@/components/shared/inputs/image-value-component';

// export type FileValue = File | File[] | null;

// type InputImageProps = {
//   multiple?: boolean;
//   label?: string;
//   name: string;
//   id?: string;
//   placeholder?: string;
//   withLabel?: boolean;
//   mandatory?: boolean;
//   disabled?: boolean;
//   labelCN?: string;
//   noErrorMessage?: boolean;
//   noClear?: boolean;
//   additionalOnChange?: (file: FileValue) => void;
//   additionalOnClear?: () => void;
// };

// export default function InputImage({
//   multiple = false,
//   withLabel = true,
//   label,
//   name,
//   id,
//   placeholder,
//   mandatory,
//   disabled,
//   labelCN,
//   noErrorMessage,
//   noClear,
//   additionalOnChange,
//   additionalOnClear,
// }: InputImageProps) {
//   const { setValue } = useFormContext();
//   const {
//     field,
//     fieldState: { error },
//   } = useController({ name });

//   const testOnChange = (file: FileValue) => {
//     field.onChange(file);
//     additionalOnChange?.(file);
//   };

//   return (
//     <div>
//       {withLabel && (
//         <label
//           htmlFor={id || name}
//           className={cn('mb-1 inline-block', labelCN)}
//         >
//           {label || startCase(name)}
//           {mandatory && <span className='text-[#f00]'>*</span>}
//         </label>
//       )}

//       <div className='relative'>
//         <FileInput
//           ref={field.ref}
//           value={field.value}
//           name={field.name}
//           onChange={testOnChange}
//           onBlur={field.onBlur}
//           accept='image/jpeg, image/png, image/avif, image/gif, image/webp'
//           placeholder={
//             !disabled
//               ? placeholder ||
//                 label ||
//                 `Select ${lowerCase(name)}...` ||
//                 'Select file...'
//               : undefined
//           }
//           multiple={multiple}
//           valueComponent={ImageValueComponent}
//         />
//         {!noClear && field.value && !disabled && (
//           <div className='absolute right-[.3rem] top-[50%] grid h-full shrink-0 translate-y-[-50%] place-items-center'>
//             <button
//               type='button'
//               className='rounded-md p-1 opacity-50 hover:bg-grayish/50'
//               onClick={() => {
//                 setValue(name, null, {
//                   shouldValidate: true,
//                 });
//                 additionalOnClear?.();
//               }}
//             >
//               <X size={16} className=' ' />
//             </button>
//           </div>
//         )}
//       </div>

//       {!noErrorMessage && error?.message && (
//         <p className='text-xs text-red-600'>{error.message}</p>
//       )}
//     </div>
//   );
// }
