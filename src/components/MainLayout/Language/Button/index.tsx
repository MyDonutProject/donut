import { IconButton } from '@/components/core/IconButton';
import { ModalsKey } from '@/enums/modalsKey';
import { useModal } from '@/hooks/modal/useModal';
import { useRouter } from 'next/router';

export default function LanguageButton() {
  const { push } = useRouter();

  function handleLanguageModal() {
    push({
      hash: ModalsKey.Language
    });
  }

  return (
    <IconButton onClick={handleLanguageModal}>
      <i className="fad fa-globe" />
    </IconButton>
  );
}
