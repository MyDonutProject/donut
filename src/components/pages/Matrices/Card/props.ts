import { MatrixSlot } from "@/models/matrices/slots"
import { MatrixStatus } from "@/models/matrices/statuses"

export interface MatrixCardProps {
  title: string
  slots: MatrixSlot[]
  status: MatrixStatus
}
