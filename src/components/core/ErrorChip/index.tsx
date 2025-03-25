import useTranslation from 'next-translate/useTranslation';
import { ErrorChipProps } from './props';
import styles from './styles.module.scss';

/**
 * ErrorChip Component
 * A compact error display component with an icon and message that can be clicked
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} [props.action] - Optional click handler function
 * @param {boolean} [props.cardBg=false] - Whether to use card background styling
 * @returns {JSX.Element} Error chip with icon and translated message
 */
export function ErrorChip({ action, cardBg = false }: ErrorChipProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className={`${styles.container} ${cardBg ? styles['container--cardBg'] : ''}`}
      onClick={action}
    >
      <div className={styles['container__title-container']}>
        <div className={styles.container__swoosh}>
          <i className="fad fa-exclamation-triangle" />
        </div>
      </div>
      <div className={styles.container__spacer} />
      <div className={styles.container__row}>
        <div className={styles.container__divider} />
        <div className={styles.container__message}>
          {t('error_secondary_description')}
        </div>
      </div>
    </div>
  );
}
