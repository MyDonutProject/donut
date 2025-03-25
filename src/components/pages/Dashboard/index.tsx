import DashboardChart from './Chart';
import DashboardInvite from './Invite';
import DashboardMatrices from './Matrices';
import DashboardRewards from './Rewards';

export default function Dashboard() {
  return (
    <>
      <DashboardRewards />
      <DashboardMatrices />
      <DashboardInvite />
      <DashboardChart />
    </>
  );
}
