import { GenericError } from "@/models/generic-error"
import { store } from "@/store"
import { AxiosError } from "axios"
import { NotificationsService } from "./NotificationService"

export class ErrorService {
  static extractError(error: AxiosError<GenericError>): string {
    if (!!error?.response?.data?.errors) {
      return error.response.data.errors[0]
    }

    return Array.isArray(error?.response?.data?.message)
      ? error?.response?.data?.message[0]
      : error?.response?.data?.message
  }

  static onError(
    error: {
      name: string
      error: {
        message: string
      }
    },
    title?: string
  ) {
    const notificationsService = new NotificationsService(store)

    notificationsService.error({
      title: title ? title : `${error?.name ?? 500}`,
      message: error.error.message,
    })
  }
}
