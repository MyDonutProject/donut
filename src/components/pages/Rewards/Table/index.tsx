import { useUserBalance } from "@/api/balance"
import { NoDataComponent } from "@/components/core/NoDataComponent"
import { Decimal } from "@/lib/Decimal"
import useTranslation from "next-translate/useTranslation"
import { useMemo } from "react"
import Card from "./Card"
import styles from "./styles.module.scss"
import { useUserTransactions } from "@/api/transactions"
import { ErrorCard } from "@/components/core/ErrorCard"
import { useChainlinkOracle } from "@/api/price/queries"
import { Transaction } from "@/models/transactions"

export default function RewardsTable() {
  const { t } = useTranslation("common")
  const { data: userBalance, isPending: isBalancePending } =
    useUserBalance()
  const {
    data: userTransactions,
    isPending: isTransactionsPending,
    error,
    refetch,
  } = useUserTransactions()
  const { isPending } = useChainlinkOracle()

  const isLoading =
    isBalancePending || isTransactionsPending || isPending

  const donuts: Transaction[] = useMemo(() => {
    if (
      !userBalance ||
      !userTransactions ||
      typeof window === "undefined"
    ) {
      return []
    }

    return [userBalance?.reservedTokens]
      .map(
        (t) =>
          ({
            symbol: "DNT",
            amount: Decimal.fromSubunits(t?.toString() ?? "0", {
              scale: 9,
            }),
            createdAt: new Date().toISOString(),
            id: window.crypto.randomUUID() as any,
            hash: "",
            url: "",
            walletId: BigInt(0),
          } as Transaction)
      )
      .concat(
        ...(userTransactions?.data?.filter(
          (t) => t?.symbol === "DNT"
        ) || [])
      )
  }, [userBalance?.reservedTokens, userTransactions?.data])

  const solanas: Transaction[] = useMemo(() => {
    if (
      !userBalance ||
      !userTransactions ||
      typeof window === "undefined"
    ) {
      return []
    }

    return [userBalance?.reservedSol]
      .map(
        (t) =>
          ({
            symbol: "SOL",
            amount: Decimal.fromSubunits(t?.toString() ?? "0", {
              scale: 9,
            }),
            createdAt: new Date().toISOString(),
            id: window.crypto.randomUUID() as any,
            hash: "",
            url: "",
            walletId: BigInt(0),
          } as Transaction)
      )
      .concat(
        ...(userTransactions?.data?.filter(
          (t) => t?.symbol === "SOL"
        ) || [])
      )
  }, [userBalance?.reservedSol, userTransactions?.data])

  const Donuts = useMemo(
    () =>
      donuts.map((item, index) => (
        <Card
          item={item as Transaction}
          key={`donut-card-${item?.id?.toString()}`}
          locked={index === 0}
        />
      )),
    [donuts]
  )

  const Solanas = useMemo(
    () =>
      solanas.map((item, index) => (
        <Card
          item={item as Transaction}
          key={`solana-card-${item?.id?.toString()}`}
          locked={index === 0}
        />
      )),
    [solanas]
  )

  const Skeletons = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => (
        <Card
          isLoading
          item={{} as Transaction}
          key={`skeleton-${index}`}
        />
      )),
    []
  )

  if (error) {
    return <ErrorCard error={error} refetch={refetch} />
  }

  console.log({ donuts, solanas })

  return (
    <div className={styles.container}>
      <div className={styles.container__row}>
        <div className={styles.container__row__heading}>
          {t("minted_donuts")}
        </div>
      </div>
      {isLoading ? Skeletons : null}
      {!isLoading && Donuts?.length > 0 && Donuts}
      {!isLoading && Donuts?.length === 0 && <NoDataComponent />}
      <div className={styles.container__row}>
        <div className={styles.container__row__heading}>
          {t("earned_sol")}
        </div>
      </div>
      {isLoading ? Skeletons : null}
      {!isLoading && Solanas?.length > 0 && Solanas}
      {!isLoading && Solanas?.length === 0 && <NoDataComponent />}
    </div>
  )
}
