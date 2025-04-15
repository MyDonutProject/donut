import { Decimal } from "@/lib/Decimal";
import { PriceUpdate } from "@pythnetwork/hermes-client";
import {
  HermesActions,
  HermesStatePayload,
  HermesStateProps,
  SetPriceHistoryPayload,
  SetPricePayload,
} from "./props";

let initialState: HermesStateProps = {
  price: null,
  priceHistory: [],
  decimalPrice: new Decimal(0, { scale: 8 }),
};

export default function reducer(
  state: HermesStateProps = initialState,
  action: HermesStatePayload
): HermesStateProps {
  switch (action.type) {
    case HermesActions.SetPrice: {
      const price: PriceUpdate = (action as SetPricePayload).payload;

      return {
        ...state,
        ...{
          price: price,
          decimalPrice: Decimal.fromSubunits(
            price?.parsed?.[0]?.price?.price ?? "0",
            { scale: 8 }
          ),
        },
      };
    }
    case HermesActions.SetPriceHistory: {
      const priceHistory: PriceUpdate[] = (action as SetPriceHistoryPayload)
        .payload;

      return { ...state, ...{ priceHistory: priceHistory } };
    }
    default:
      return state;
  }
}
