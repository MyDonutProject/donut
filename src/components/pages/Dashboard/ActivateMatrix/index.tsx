import { useBinanceTicker } from "@/api/binance/queries";
import { Button } from "@/components/core/Button";
import { ErrorCard } from "@/components/core/ErrorCard";
import { Input } from "@/components/core/Input";
import useAccount from "@/hooks/account/useAccount";
import { Decimal } from "@/lib/Decimal";
import useTranslation from "next-translate/useTranslation";
import styles from "./styles.module.scss";

export default function ActivateMatrix() {
  const { t } = useTranslation("common");
  const { balance } = useAccount();
  const {
    data: tickerData,
    isPending: isTickerPending,
    error: tickerError,
    refetch: refetchTicker,
  } = useBinanceTicker({ symbol: "SOLUSDT" });

  const error = tickerError;

  function handleRefetch() {
    if (tickerError) {
      refetchTicker();
    }
  }

  if (error) {
    return <ErrorCard error={error} refetch={handleRefetch} />;
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h1>{t("activate_matrix_title")}</h1>
        <div className={styles.card__row}>
          <span className={styles.card__row__label}>{t("sending_label")}</span>
          <span className={styles.card__row__value}>
            <i className="fa-solid fa-wallet" />
            <span>{new Decimal(balance, { scale: 8 }).toNumberString()}</span>
          </span>
        </div>
        <Input
          value={0.058}
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
            <span>{0.000004} SOL</span>
          </div>
        </div>
        <Button>
          <span>{t("activate_matrix_button")}</span>
        </Button>
      </div>
    </div>
  );
}
