import { Transaction } from "@/models/transactions"

export interface CardProps {
  item: Transaction
  locked?: boolean
  isLoading?: boolean
}
