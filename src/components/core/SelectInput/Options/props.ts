import { Nullable } from '@/interfaces/nullable';
import { ICustomComponents } from '../props';
import { AxiosError } from 'axios';
import { GenericError } from '@/models/generic-error';

export interface OptionsProps<T, V> {
  isInverted?: boolean;
  cardBg?: boolean;
  handleClose(): void;
  customComponents?: ICustomComponents<T>;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => V;
  options: T[];
  isAsync?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  hasNextPage?: boolean;
  loadMore?: () => void;
  setValue: (value: T) => void;
  value: V;
  error?: Nullable<AxiosError<GenericError, any>>;
  refetch?: VoidFunction;
  popLayout?: boolean;
  parentBounding?: DOMRect;
}
