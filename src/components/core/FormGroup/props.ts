import { AxiosError } from 'axios';
import { GenericError } from '@/models/generic-error';
import { JSX } from 'react';

export interface FormGroupLoadingProps {
  label?: boolean;
  description?: boolean;
  secondary?: boolean;
}

export interface FormGroupProps {
  label?: string;
  info?: JSX.Element;
  className?: string;
  description?: string;
  loading?: FormGroupLoadingProps;
  isLoading?: boolean;
  alignCenter?: boolean;
  primary?: boolean;
  optional?: boolean;
  optionalLabel?: string;
  action?: JSX.Element;
  error?: AxiosError<GenericError>;
  refetch?: () => void;
  secondary?: boolean;
}
