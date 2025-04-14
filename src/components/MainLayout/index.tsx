import { useUserAccount } from "@/api/account";
import useContractInteraction from "@/hooks/contract/useContractInteraction";
import { PropsWithChildren } from "react";
import Layout from "../Layout";
import NotificationToasty from "../Notifications/Toasty";
import ProfileDrawer from "../Profile/Drawer";
import Header from "./Header";
import LanguageModal from "./Language/Modal";

export default function MainLayout({ children }: PropsWithChildren) {
  useContractInteraction();
  useUserAccount();

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
