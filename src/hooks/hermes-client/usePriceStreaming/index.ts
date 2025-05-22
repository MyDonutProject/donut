import { getStore } from "@/store";
import { setPrice } from "@/store/hermes/actions";
import { Chainlink } from "dev3-sdk";
import { useCallback, useEffect } from "react";

const solSdk = Chainlink.instance(
  process.env.NEXT_PUBLIC_JSON_RPC,
  Chainlink.PriceFeeds.ETH
);

// Minimum deposit amount in USD (10 dollars in base units - 8 decimals)

// Maximum price feed staleness (24 hours in seconds)
const MAX_PRICE_FEED_AGE = 86400;

// Default SOL price in case of stale feed ($100 USD per SOL)
const DEFAULT_SOL_PRICE = 100_00000000; // $100 with 8 decimals

export function usePriceStreaming(): void {
  const throttleInterval = 5000; // 5 seconds in milliseconds

  const handlePriceStreaming = useCallback(() => {
    const handleSubscribe = async () => {
      const priceFeed = await solSdk
        .getFromOracle(solSdk.feeds.SOL_USD)
        .then((res) => ({
          price: res.answer.toString(),
          startedAt: new Date(
            Number(res.startedAt.toString()) * 1000
          ).toISOString(),
        }));

      if (!priceFeed?.price) {
        return;
      }

      const interval = setInterval(() => {
        if (
          Date.now() - new Date(priceFeed.startedAt).getTime() >
          MAX_PRICE_FEED_AGE * 1000
        ) {
          getStore().dispatch(setPrice(DEFAULT_SOL_PRICE.toString()));
          return;
        }

        getStore().dispatch(setPrice(priceFeed?.price));
      }, throttleInterval);

      return () => clearInterval(interval);
    };

    handleSubscribe();
  }, []);

  useEffect(handlePriceStreaming, [handlePriceStreaming]);
}
