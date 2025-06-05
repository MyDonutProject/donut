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

  static onError(error: any, title?: string) {
    const notificationsService = new NotificationsService(store)
    console.log("📋 DETAILED ERROR LOGS:")

    //@ts-ignore
    if (error?.logs) {
      console.log("\n📋 LOGS DE ERRO DETALHADOS:")
      const relevantLogs = error.logs.filter(
        (log) =>
          log.includes("Program log:") ||
          log.includes("Error") ||
          log.includes("error")
      )

      if (relevantLogs.length > 0) {
        relevantLogs.forEach((log, i) => {
          console.log(`  ${i}: ${log}`)
          notificationsService.error({
            title: title
              ? title
              : `error_${error?.response?.data?.statusCode ?? 500}`,
            message: log,
          })
        })
      } else {
        error.logs.forEach((log, i) => {
          console.log(`  ${i}: ${log}`)
          notificationsService.error({
            title: title
              ? title
              : `error_${error?.response?.data?.statusCode ?? 500}`,
            message: log,
          })
        })
      }
    }
  }
}
