import { useUserAccount } from "@/api/account";
import useAccount from "@/hooks/account/useAccount";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import Layout from "../Layout";
import NotificationToasty from "../Notifications/Toasty";
import ProfileDrawer from "../Profile/Drawer";
import Header from "./Header";

export default function MainLayout({ children }: PropsWithChildren) {
  useUserAccount();
  const { address } = useAccount();
  const { query } = useRouter();

  function handleSetSponsor() {
    if (typeof window === "undefined" || !!address) {
      return;
    }

    if (query?.sponsor) {
      localStorage.setItem("sponsor", String(query?.sponsor));
    }
  }

  useEffect(handleSetSponsor, [address]);

  return (
    <>
      <NotificationToasty />
      <Header />
      <ProfileDrawer />
      <Layout>{children}</Layout>
    </>
  );
}
