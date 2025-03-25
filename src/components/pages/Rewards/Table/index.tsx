import { TableGrid } from '@/components/core/TableGrid';
import { rewardColumns } from '@/constants/rewards-columns';

export default function RewardsTable() {
  return (
    <TableGrid
      rows={[
        {
          symbol: 'donut',
          amount: 500,
          createdAt: new Date(),
        },
        {
          symbol: 'donut',
          amount: 500,
          createdAt: new Date(),
        },
        {
          symbol: 'donut',
          amount: 500,
          createdAt: new Date(),
        },
        {
          symbol: 'sol',
          amount: 0.5,
          createdAt: new Date(),
        },
        {
          symbol: 'sol',
          amount: 0.5,
          createdAt: new Date(),
        },
        {
          symbol: 'sol',
          amount: 0.5,
          createdAt: new Date(),
        },
      ]}
      columns={rewardColumns as any}
    />
  );
}
