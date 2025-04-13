import useContractInteraction from "@/hooks/contract/useContractInteraction";
import ActivateMatrix from "./ActivateMatrix";
import DashboardChart from "./Chart";
import DashboardInvite from "./Invite";
import DashboardMatrices from "./Matrices";
import DashboardRewards from "./Rewards";

export default function Dashboard() {
  const { referrerTokenAccount } = useContractInteraction();
  const isActivated = !!referrerTokenAccount;

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
