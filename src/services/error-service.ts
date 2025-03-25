import { AxiosError } from 'axios';
import { NotificationsService } from './NotificationService';
import { store } from '@/store';
import { GenericError } from '@/models/generic-error';

export class ErrorService {
  static extractError(error: AxiosError<GenericError>): string {
    if (!!error?.response?.data?.errors) {
      return error.response.data.errors[0];
    }

    return Array.isArray(error?.response?.data?.message)
      ? error?.response?.data?.message[0]
      : error?.response?.data?.message;
  }

  static onError(error: AxiosError<GenericError>, title?: string) {
    const errorMessage: string = ErrorService.extractError(error);
    const notificationsService = new NotificationsService(store);

    notificationsService.error({
      title: title
        ? title
        : `error_${error?.response?.data?.statusCode ?? 500}`,
      message: errorMessage,
    });
  }
}
