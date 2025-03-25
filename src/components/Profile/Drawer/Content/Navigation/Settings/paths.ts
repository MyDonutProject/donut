import { ModalsKey } from '@/enums/modalsKey';
import { PageProps } from '@/types/navigation';

export const navigationSettingsPaths: Array<PageProps> = [
  {
    label: 'tab_language',
    path: '',
    modal: ModalsKey.Language,
    icon: 'fa-solid fa-globe',
  },
];
