import { Decimal } from "@/lib/Decimal"
import {
  HermesActions,
  HermesStatePayload,
  HermesStateProps,
  SetPriceHistoryPayload,
  SetPricePayload,
} from "./props"

let initialState: HermesStateProps = {
  price: null,
  priceHistory: [],
  decimalPrice: new Decimal(0, { scale: 9 }),
  equivalence: new Decimal(0, { scale: 9 }),
  dntPrice: new Decimal(0, { scale: 9 }),
  updatedAt: new Date(),
}

export default function reducer(
  state: HermesStateProps = initialState,
  action: HermesStatePayload
): HermesStateProps {
  switch (action.type) {
    case HermesActions.SetPrice: {
      const price: string = (action as SetPricePayload).payload

      const decimalPrice = Decimal.fromSubunits(price ?? "0", {
        scale: 8,
      }).copyWith({
        options: { scale: 9 },
      })

      const equivalence = new Decimal(10, {
        scale: decimalPrice.scale,
      }).divide(
        decimalPrice.copyWith({
          options: { scale: decimalPrice.scale },
        })
      )

      return {
        ...state,
        ...{
          price: decimalPrice,
          decimalPrice,
          equivalence,
        },
        updatedAt: new Date(),
      }
    }
    case HermesActions.SetPriceHistory: {
      const priceHistory: string[] = (
        action as SetPriceHistoryPayload
      ).payload

      return { ...state, ...{ priceHistory: priceHistory } }
    }
    default:
      return state
  }
}
