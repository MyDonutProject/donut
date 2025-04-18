import { useUserAccount } from "@/api/account";
import { ModalsKey } from "@/enums/modalsKey";
import useAccount from "@/hooks/account/useAccount";
import { hasCookie, setCookie } from "cookies-next";
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

    if (!hasCookie("sponsor")) {
      push({
        hash: ModalsKey.Sponsor,
      });
      return;
    }

    if (query?.sponsor) {
      setCookie("sponsor", query?.sponsor, {
        maxAge: 60 * 60 * 24 * 30,
      });
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
