import { Nullable } from '@/interfaces/nullable';
import { GenericError } from '@/models/generic-error';
import { AxiosError } from 'axios';
import { JSX } from 'react';

interface FCOptionProps<T> {
  handleSelect: (value: T) => void;
  option: T;
  selected: boolean;
  key: string;
}

interface FCInputProp<T> {
  handleOpen: () => void;
  open: boolean;
  option?: T;
}

export interface ICustomComponents<T> {
  customSkeletonInput?(): JSX.Element;
  customSkeletonOption?(key: string): JSX.Element;
  customInput?(config: FCInputProp<T>): JSX.Element;
  customOption?(option: FCOptionProps<T>): JSX.Element;
}

export interface SelectInputProps<T, V> {
  setValue: (value: T) => void;
  value: V;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => V;
  loading?: boolean;
  loadingMore?: boolean;
  hasNextPage?: boolean;
  invertOptionsPosition?: boolean;
  loadMore?: () => void;
  disabled?: boolean;
  customComponents?: ICustomComponents<T>;
  cardBg?: boolean;
  secondaryText?: boolean;
  isAsync?: boolean;
  error?: Nullable<AxiosError<GenericError, any>>;
  refetch?: VoidFunction;
  disableClickOutside?: boolean;
  popLayout?: boolean;
}
