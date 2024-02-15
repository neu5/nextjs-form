import clsx from 'clsx';
import { ValueOf } from '../lib/definitions';

export const BUTTON_KINDS = {
  ADD: 'add',
  REMOVE: 'remove',
  SUBMIT: 'submit',
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ValueOf<typeof BUTTON_KINDS>;
  children: React.ReactNode;
}

export function Button({
  children,
  className,
  kind = 'submit',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        {
          'bg-green-500 hover:bg-green-400 focus-visible:outline-green-500 active:bg-green-600':
            kind === BUTTON_KINDS.ADD,
          'bg-blue-500 hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600':
            kind === BUTTON_KINDS.SUBMIT,
          'bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600':
            kind === BUTTON_KINDS.REMOVE,
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
