import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-[60px] p-2 pl-10 w-full border border-[var(--gray)] bg-background text-sm focus:outline-none focus:ring-2',
        className
      )}
      style={{
        '--tw-ring-color': 'var(--green)',
      }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
