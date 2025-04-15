import { PriceUpdate } from "@pythnetwork/hermes-client";
import {
  HermesActions,
  SetPriceHistoryPayload,
  SetPricePayload,
} from "./props";

export function setPrice(price: PriceUpdate): SetPricePayload {
  return { type: HermesActions.SetPrice, payload: price };
}

export function setPriceHistory(
  payload: PriceUpdate[]
): SetPriceHistoryPayload {
  return {
    type: HermesActions.SetPriceHistory,
    payload,
  };
}
