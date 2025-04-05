import ActivateMatrix from "./ActivateMatrix";
import DashboardChart from "./Chart";
import DashboardInvite from "./Invite";
import DashboardMatrices from "./Matrices";
import DashboardRewards from "./Rewards";

export default function Dashboard() {
  const isActivated = true;

  if (!isActivated) {
    return (
      <>
        <DashboardRewards />
        <ActivateMatrix />
      </>
    );
  }

  return (
    <>
      <DashboardRewards />
      <DashboardMatrices />
      <DashboardInvite />
      <DashboardChart />
    </>
  );
}
