import styles from './styles.module.scss';
import sharedStyles from '../styles.module.scss';
import { NotificationRowType } from '../../props';
import { BaseContentProps } from '../../props';

export default function BaseContent({
  type,
  icon,
  title,
  isError,
  createdAt,
  components,
  description,
}: BaseContentProps) {
  const isRow: boolean = type === NotificationRowType.Row;

  return (
    <>
      <div className={`${styles.box} ${isError ? styles['box--error'] : ''}`}>
        <i className={icon} />
      </div>

      <div
        className={`${sharedStyles.column} ${isRow ? sharedStyles['column--row'] : ''}`}
      >
        <div className={sharedStyles.row}>
          <h6 className={sharedStyles.column__title}>{title}</h6>

          <span className={sharedStyles.column__time}>{createdAt}</span>
        </div>
        <p className={sharedStyles.column__description}>{description}</p>
      </div>
    </>
  );
}
