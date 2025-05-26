import { Decimal } from "@/lib/Decimal"

export type HermesStateProps = {
  price: Decimal
  priceHistory: string[]
  decimalPrice: Decimal
  equivalence: Decimal
  dntPrice: Decimal
  updatedAt: Date
}

export enum HermesActions {
  SetPrice = "hermes/set-price",
  SetPriceHistory = "hermes/set-price-history",
}

export interface HermesBasePayload<
  T extends HermesActions,
  V = null
> {
  type: T
  payload: V
}
export type SetPricePayload = HermesBasePayload<
  HermesActions.SetPrice,
  string
>

export type SetPriceHistoryPayload = HermesBasePayload<
  HermesActions.SetPriceHistory,
  string[]
>

export type HermesStatePayload =
  | SetPricePayload
  | SetPriceHistoryPayload
