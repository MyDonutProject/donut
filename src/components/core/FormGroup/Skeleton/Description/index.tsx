import styles from '../../styles.module.scss';
import { FormGroupProps } from '../../props';

export default function FormGroupSkeletonDescription({ loading }: Pick<FormGroupProps, 'loading'>) {
  if (!loading?.description) {
    return null;
  }

  return (
    <div
      className={
        loading.secondary ?? true
          ? styles['container__description__skeleton--secondary']
          : styles['container__description__skeleton']
      }
    />
  );
}
