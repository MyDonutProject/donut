import { Chainlink } from "dev3-sdk"
import { UseChainlinkOracleQueryKeyProps } from "./props"
import { QueryFunctionContext } from "@tanstack/react-query"
import { PriceFeed } from "../../props"

const solSdk = Chainlink.instance(
  process.env.NEXT_PUBLIC_JSON_RPC,
  Chainlink.PriceFeeds.ETH
)

export async function fetchSolPrice({
  queryKey,
}: QueryFunctionContext<UseChainlinkOracleQueryKeyProps>): Promise<PriceFeed> {
  const priceFeed = await solSdk.getFromOracle(solSdk.feeds.SOL_USD)

  return {
    price: priceFeed.answer.toString(),
    startedAt: new Date(
      Number(priceFeed.startedAt.toString()) * 1000
    ).toISOString(),
  }
}
