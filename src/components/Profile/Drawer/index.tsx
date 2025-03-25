import useTranslation from 'next-translate/useTranslation';
import ProfileDrawerContent from './Content';
import { ModalsKey } from '@/enums/modalsKey';
import useAccount from '@/hooks/account/useAccount';
import { useModal } from '@/hooks/modal';
import { PageDrawer } from '@/components/core/PageDrawer';

export default function ProfileDrawer() {
  const { t } = useTranslation('common');
    const { isOpen, onClose } = useModal(ModalsKey.ProfileDetails);
  const { isConnected } = useAccount();

  function handleClose() {
    onClose();
  }

  if (!isConnected) {
    return null;
  }

  return (
    <PageDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={t('profile_label')}
    >
      <ProfileDrawerContent />
    </PageDrawer>
  );
}
