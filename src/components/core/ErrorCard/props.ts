import { Nullable } from '@/interfaces/nullable';
import { GenericError } from '@/models/generic-error';
import { AxiosError } from 'axios';

export interface ErrorCardProps {
  error: Nullable<AxiosError<GenericError>>;
  refetch: () => void;
  customBackground?: string;
  isDefaultColor?: boolean;
}
