import { getStore } from "@/store";
import { setPrice } from "@/store/hermes/actions";
import { HermesClient, PriceUpdate } from "@pythnetwork/hermes-client";
import { useCallback, useEffect, useRef } from "react";

export function usePriceStreaming(): void {
  const connection: HermesClient = new HermesClient(
    process.env.NEXT_PUBLIC_HERMES_URL,
    {
      timeout: 5000,
    }
  );

  const lastDispatchTime = useRef<number>(0);
  const throttleInterval = 5000; // 5 seconds in milliseconds

  const handlePriceStreaming = useCallback(() => {
    const handleSubscribe = async () => {
      const priceFeeds = await connection.getPriceFeeds({
        query: "sol/usd",
        assetType: "crypto",
      });

      const priceFeed = priceFeeds.find(
        (price) => price?.attributes?.generic_symbol === "SOLUSD"
      );

      if (!priceFeed) {
        return;
      }

      const eventSource = await connection.getPriceUpdatesStream(
        [priceFeed.id],
        {
          ignoreInvalidPriceIds: true,
        }
      );

      eventSource.onmessage = (data: MessageEvent<PriceUpdate>) => {
        const currentTime = Date.now();
        if (currentTime - lastDispatchTime.current >= throttleInterval) {
          const parsedPriceUpdate: PriceUpdate =
            typeof data?.data === "string"
              ? JSON.parse(data?.data)
              : data?.data;

          getStore().dispatch(setPrice(parsedPriceUpdate));
          lastDispatchTime.current = currentTime;
        }
      };
    };

    handleSubscribe();
  }, [connection]);

  useEffect(handlePriceStreaming, [handlePriceStreaming]);
}
