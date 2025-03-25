import { CoinCellProps } from './props';
import styles from './styles.module.scss';

export default function CoinCell({ symbol }: CoinCellProps) {
  return (
    <div className={styles.container}>
      <img
        src={
          symbol === 'sol' ? '/donut/sol/sol.png' : `/donut/assets/donut.png`
        }
        alt={symbol}
        className={styles.container__image}
      />
      <span className={styles.container__symbol}>{symbol?.toUpperCase()}</span>
    </div>
  );
}
