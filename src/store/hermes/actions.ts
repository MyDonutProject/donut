import {
  HermesActions,
  SetPriceHistoryPayload,
  SetPricePayload,
} from "./props";

export function setPrice(price: string): SetPricePayload {
  return { type: HermesActions.SetPrice, payload: price };
}

export function setPriceHistory(payload: string[]): SetPriceHistoryPayload {
  return {
    type: HermesActions.SetPriceHistory,
    payload,
  };
}
