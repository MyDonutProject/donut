import styles from '../../styles.module.scss';
import { FormGroupProps } from '../../props';

export default function FormGroupSkeletonLabel({ loading }: Pick<FormGroupProps, 'loading'>) {
  if (!loading?.label) {
    return null;
  }

  return (
    <div
      className={
        loading.secondary ?? true
          ? styles['container__label__skeleton--secondary']
          : styles['container__label__skeleton']
      }
    />
  );
}
