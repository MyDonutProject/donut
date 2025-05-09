import { GenericError } from "@/models/generic-error";
import { store } from "@/store";
import { AxiosError } from "axios";
import { NotificationsService } from "./NotificationService";

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
    const notificationsService = new NotificationsService(store);
    console.log("📋 DETAILED ERROR LOGS:");
    //@ts-ignore
    error?.logs?.forEach?.((log, index) => {
      if (log.includes("insufficient funds")) {
        notificationsService.error({
          title: title
            ? title
            : `error_${error?.response?.data?.statusCode ?? 500}`,
          message: "insufficient_funds_for_reserve_operation",
        });
      } else if (log.includes("invalid account")) {
        console.error("💡 Error: Missing or invalid reserve accounts");
        notificationsService.error({
          title: title
            ? title
            : `error_${error?.response?.data?.statusCode ?? 500}`,
          message: "missing_or_invalid_reserve_accounts",
        });
      } else {
        if (index > 1) {
          return;
        }
        notificationsService.error({
          title: title
            ? title
            : `error_${error?.response?.data?.statusCode ?? 500}`,
          message: log,
        });
      }
    });
  }
}
