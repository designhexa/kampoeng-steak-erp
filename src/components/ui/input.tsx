import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { className, disabled, ...rest } = props;
  return (
    <input
      ref={ref}
      className={clsx('w-full rounded-md border px-3 py-2 text-sm bg-input text-foreground placeholder:opacity-60', className)}
      disabled={disabled}
      {...rest}
    />
  );
});
Input.displayName = 'Input';
