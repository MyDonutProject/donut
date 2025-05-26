// Maximum price feed staleness (24 hours in seconds)
export const MAX_PRICE_FEED_AGE = 86400

// Default SOL price in case of stale feed ($100 USD per SOL)
export const DEFAULT_SOL_PRICE = 100_00000000 // $100 with 8 decimals

export interface PriceFeed {
  price: string
  startedAt: string
}
