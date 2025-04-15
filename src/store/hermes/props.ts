import { Decimal } from "@/lib/Decimal";
import { PriceUpdate } from "@pythnetwork/hermes-client";

export type HermesStateProps = {
  price: PriceUpdate;
  priceHistory: PriceUpdate[];
  decimalPrice: Decimal;
};

export enum HermesActions {
  SetPrice = "hermes/set-price",
  SetPriceHistory = "hermes/set-price-history",
}

export interface HermesBasePayload<T extends HermesActions, V = null> {
  type: T;
  payload: V;
}
export type SetPricePayload = HermesBasePayload<
  HermesActions.SetPrice,
  PriceUpdate
>;

export type SetPriceHistoryPayload = HermesBasePayload<
  HermesActions.SetPriceHistory,
  PriceUpdate[]
>;

export type HermesStatePayload = SetPricePayload | SetPriceHistoryPayload;
