import styles from './styles.module.scss';
import { RewardsCardProps } from '../props';
import { useMemo } from 'react';

export default function RewardsCardImage({
  image,
}: Pick<RewardsCardProps, 'image'>) {
  const Images = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, index) => (
        <img
          src={image}
          alt={`image-${index}`}
          className={`${styles.image} ${styles[`image--${index}`]}`}
        />
      )),
    [image],
  );
  return Images;
}
