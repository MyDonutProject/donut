import { useUserAccount } from "@/api/account"
import { usePrepareAccounts } from "@/api/contracts/mutations/usePrepareAccounts"
import { Button } from "@/components/core/Button"
import { Input } from "@/components/core/Input"
import useAccount from "@/hooks/account/useAccount"
import { useGetLookUpTableAccount } from "@/hooks/contract/useLookUpTableAccount"
import { useProgram } from "@/hooks/contract/useProgram"
import { useNotificationService } from "@/hooks/notifications/useNotificationService"
import { Decimal } from "@/lib/Decimal"
import { RootState } from "@/store"
import {
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import ActivateMatrixSkeleton from "./Skeleton"
import styles from "./styles.module.scss"
import Countdown from "./Countdown"
import { useChainlinkOracle } from "@/api/price/queries"

export default function ActivateMatrix() {
  const { t } = useTranslation("common")
  const { balance, connection } = useAccount()
  const { handleSubmit, register } = useForm<{ amount: number }>()
  const { program } = useProgram()
  const price = useSelector(
    (state: RootState) => state.hermes.decimalPrice
  )
  const equivalence = useSelector(
    (state: RootState) => state.hermes.equivalence
  )

  const {
    isPending: isPendingPrice,
    isRefetching: isRefetchingPrice,
  } = useChainlinkOracle()

  const { mutate, isPending } = usePrepareAccounts()
  const { wallet } = useWallet()
  const { NotificationsService } = useNotificationService()
  const { getLookupTableAccount } = useGetLookUpTableAccount()
  const { isPending: isPendingAccount } = useUserAccount()

  const anchorWallet = useAnchorWallet()

  function onSubmit(data: { amount: number }) {
    mutate({
      amount: String(
        equivalence
          .copyWith({
            options: { scale: 9 },
          })
          .multiply(1.01).subunits
      ),
      connection: connection,
      program: program,
      wallet,
      anchorWallet,
      notificationService: NotificationsService,
      getLookupTableAccount,
    })
  }

  const isLocked =
    equivalence?.toNumber() === 0 ||
    isPendingPrice ||
    isRefetchingPrice

  if (isPendingAccount) {
    return <ActivateMatrixSkeleton />
  }

  return (
    <div className={styles.card}>
      <form
        className={styles.card__content}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>{t("activate_matrix_title")}</h1>
        <div className={styles.card__row}>
          <span className={styles.card__row__value}>
            <Countdown />
            {t("rate_label")}
            <strong>
              1 SOL ={" "}
              {isLocked ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                price?.toNumberString()
              )}
            </strong>
          </span>
          <span className={styles.card__row__value}>
            <i className="fa-solid fa-wallet" />
            <span>
              {new Decimal(balance, { scale: 9 }).toNumberString()}
            </span>
          </span>
        </div>
        <Input
          isLoading={isPendingAccount}
          register={register}
          name="amount"
          value={equivalence
            .copyWith({
              options: { scale: 9 },
            })
            .multiply(1.01)
            .toNumber()
            .toString()}
          readOnly
          hideLock={isLocked}
          rightIcon={
            isLocked ? "fa-solid fa-spinner fa-spin" : undefined
          }
          className={styles.card__input}
          customIcon={
            <div className={styles.card__chip}>
              <img
                src="/donut/sol/sol.png"
                alt="SOL"
                className={styles.card__chip__image}
              />
              <span>SOL</span>
            </div>
          }
        />

        <div className={styles.card__row}>
          <div className={styles.card__row__value}>
            {t("fee_label")}
          </div>
          <div className={styles.card__row__label}>
            <span>{0.01} SOL</span>
          </div>
        </div>
        <Button
          // disabled={isPending || isLocked}
          isloading={isPending}
          isSecondary={isPending || isLocked}
        >
          <span>{t("activate_matrix_button")}</span>
        </Button>
      </form>
    </div>
  )
}
