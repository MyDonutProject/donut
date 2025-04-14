import { useUserAccount } from "@/api/account";
import { ErrorCard } from "@/components/core/ErrorCard";
import ActivateMatrix from "./ActivateMatrix";
import DashboardChart from "./Chart";
import DashboardInvite from "./Invite";
import DashboardMatrices from "./Matrices";
import DashboardRewards from "./Rewards";

export default function Dashboard() {
  const { data: userAccount, error, refetch } = useUserAccount();

  if (error) {
    return <ErrorCard error={error} refetch={refetch} />;
  }

  if (!userAccount?.isRegistered) {
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
