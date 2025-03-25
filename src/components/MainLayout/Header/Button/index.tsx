import { formatLargeString } from '@/utils/formatLargeString';
import { Button } from '@/components/core/Button';
import styles from './styles.module.scss';
import useBlockies from '@/hooks/blockies/useBlockies';
import useAccount from '@/hooks/account/useAccount';
import useIsHomePage from '@/hooks/layout/useIsHomePage';
import useTranslation from 'next-translate/useTranslation';
export default function HeaderButton() {
  const { handleOpenAuthModal, isConnected, isSkeleton, address, status } =
    useAccount();
  const { isHomePage } = useIsHomePage();

  const blockies = useBlockies(address, {
    size: 4,
    scale: 6,
  });
  const { t } = useTranslation('common');

  if (!isConnected && status !== 'connecting') {
    return (
      <Button useMaxContent >
        {t('comming_soon')}
        {/* {t('connect_wallet')} */}
      </Button>
    );
  }

  return (
    <Button
      useMaxContent
      isActive={isHomePage}
      isSecondary={!isHomePage}
      // onClick={handleOpenAuthModal}
      isSkeleton={isSkeleton}
      className={isSkeleton ? styles.button__skeleton : ''}
    >
      <img src={blockies.toDataURL()} alt="avatar" className={styles.image} />
      {formatLargeString(address)}
    </Button>
  );
}
