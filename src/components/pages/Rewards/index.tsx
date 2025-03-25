import { useTranslation } from 'react-i18next';
import RewardsTable from './Table';

export default function Rewards() {
  const { t } = useTranslation('common');

  return (
    <>
      <RewardsTable />
    </>
  );
}
