import { Connection } from "@solana/web3.js"
import { PriceQueryKeys } from "../../queryKeys"
import { Wallet } from "@solana/wallet-adapter-react"

export interface ChainlinkConfig {
  programId: string
  feedAddress: string
  rpcUrl: string
  connection?: Connection
  wallet?: Wallet
}

export type UseChainlinkOracleQueryKeyProps = [
  PriceQueryKeys.Price,
  ChainlinkConfig
]

export interface PriceFeed {
  price: number
  decimals: number
  timestamp: number
  description: string
  roundId: string
  formattedPrice: string
  lastUpdateTime: Date
}
