import { FocusEvent, ReactNode } from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

interface DefaultInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {}
export interface InputProps<T extends FieldValues> extends DefaultInputProps {
  isError?: boolean;
  isContainerColor?: boolean;
  isCardColor?: boolean;
  errorMessage?: string | string[];
  register?: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>> | undefined;
  name?: Path<T>;
  icon?: string;
  customIcon?: ReactNode;
  showEraserButton?: boolean;
  onErase?(): void;
  isLoading?: boolean;
  hideLock?: boolean;
  showSpinner?: boolean;
  hasPaddingRight?: boolean;
  hasPaddingLeft?: boolean;
  focusOnMount?: boolean;
  rightIcon?: string;
  secondarySkeleton?: boolean;
  useTextArea?: boolean;
  onFocus?: (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
}
