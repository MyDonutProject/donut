import { useUserAccount } from "@/api/account";
import { useBinanceTicker } from "@/api/binance/queries";
import { usePrepareAccounts } from "@/api/contracts/mutations/usePrepareAccounts";
import { Button } from "@/components/core/Button";
import { ErrorCard } from "@/components/core/ErrorCard";
import { Input } from "@/components/core/Input";
import useAccount from "@/hooks/account/useAccount";
import { useGetLookUpTableAccount } from "@/hooks/contract/useLookUpTableAccount";
import { useProgram } from "@/hooks/contract/useProgram";
import { useNotificationService } from "@/hooks/notifications/useNotificationService";
import { Decimal } from "@/lib/Decimal";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import ActivateMatrixSkeleton from "./Skeleton";
import styles from "./styles.module.scss";

export default function ActivateMatrix() {
  const { t } = useTranslation("common");
  const { balance, connection } = useAccount();
  const { handleSubmit, register } = useForm<{ amount: number }>();
  const { program } = useProgram();
  const { mutate, isPending } = usePrepareAccounts();
  const { wallet } = useWallet();
  const { NotificationsService } = useNotificationService();
  const { getLookupTableAccount } = useGetLookUpTableAccount();
  const {
    error: accountError,
    refetch,
    isPending: isPendingAccount,
  } = useUserAccount();

  const anchorWallet = useAnchorWallet();
  const {
    data: tickerData,
    error: tickerError,
    refetch: refetchTicker,
  } = useBinanceTicker({ symbol: "SOLUSDT" });

  const error = tickerError;

  function onSubmit(data: { amount: number }) {
    mutate({
      amount: data.amount.toString(),
      connection: connection,
      program: program,
      wallet,
      anchorWallet,
      notificationService: NotificationsService,
      getLookupTableAccount,
    });
  }

  function handleRefetch() {
    if (tickerError) {
      refetchTicker();
    }
  }

  if (error) {
    return <ErrorCard error={error} refetch={handleRefetch} />;
  }

  if (isPendingAccount) {
    return <ActivateMatrixSkeleton />;
  }

  return (
    <div className={styles.card}>
      <form className={styles.card__content} onSubmit={handleSubmit(onSubmit)}>
        <h1>{t("activate_matrix_title")}</h1>
        <div className={styles.card__row}>
          <span className={styles.card__row__label}>{t("sending_label")}</span>
          <span className={styles.card__row__value}>
            <i className="fa-solid fa-wallet" />
            <span>{new Decimal(balance, { scale: 8 }).toNumberString()}</span>
          </span>
        </div>
        <Input
          isLoading={isPendingAccount}
          register={register}
          name="amount"
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
          <span className={styles.card__row__value}>
            {t("rate_label")}
            <strong>1 SOL = {tickerData?.askPrice?.toNumberString()}</strong>
          </span>
          <span className={styles.card__row__value}>
            <span>{new Decimal(balance, { scale: 8 }).toNumberString()}</span>
          </span>
        </div>
        <div className={styles.card__row}>
          <div className={styles.card__row__value}>{t("fee_label")}</div>
          <div className={styles.card__row__label}>
            <span>{0.01} SOL</span>
          </div>
        </div>
        <Button disabled={isPending} isloading={isPending}>
          <span>{t("activate_matrix_button")}</span>
        </Button>
      </form>
    </div>
  );
}
