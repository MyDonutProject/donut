import { useUserAccount } from "@/api/account";
import useAccount from "@/hooks/account/useAccount";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import Layout from "../Layout";
import NotificationToasty from "../Notifications/Toasty";
import ProfileDrawer from "../Profile/Drawer";
import Header from "./Header";
import LanguageModal from "./Language/Modal";

export default function MainLayout({ children }: PropsWithChildren) {
  // useContractInteraction();
  useUserAccount();
  const { address } = useAccount();
  const { push, query } = useRouter();

  function handleSetSponsor() {
    if (typeof window === "undefined" || !!address) {
      return;
    }

    if (query?.sponsor) {
      setCookie("sponsor", query?.sponsor);
    }
  }

  useEffect(handleSetSponsor, [address]);

  return (
    <>
      <NotificationToasty />
      <LanguageModal />
      <Header />
      <ProfileDrawer />
      <Layout>{children}</Layout>
    </>
  );
}
