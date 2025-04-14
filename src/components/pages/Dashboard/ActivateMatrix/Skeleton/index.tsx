import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import styles from "../styles.module.scss";
import skeleton from "./styles.module.scss";

export default function ActivateMatrixSkeleton() {
  return (
    <div className={styles.card}>
      <form className={styles.card__content}>
        <div className={skeleton.title} />
        <div className={styles.card__row}>
          <div className={skeleton.label} />
          <span className={styles.card__row__value}>
            <div className={skeleton.image} />
            <span>
              <div className={skeleton.label} />
            </span>
          </span>
        </div>
        <Input isLoading className={styles.card__input} />
        <div className={styles.card__row}>
          <span className={styles.card__row__value}>
            <div className={skeleton.label} />
            <strong>
              <div className={skeleton.label} />
            </strong>
          </span>
          <span className={styles.card__row__value}>
            <span>
              <div className={skeleton.label} />
            </span>
          </span>
        </div>
        <div className={styles.card__row}>
          <div className={skeleton.label} />
          <div className={skeleton.label}>
            <span>
              <div className={skeleton.label} />
            </span>
          </div>
        </div>
        <Button isSkeleton />
      </form>
    </div>
  );
}
