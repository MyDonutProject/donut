import { IconButton } from "@/components/core/IconButton";
import { useWallet } from "@solana/wallet-adapter-react";
import useTranslation from "next-translate/useTranslation";

export default function LogoutButton() {
  const { t } = useTranslation("common");
  const wallet = useWallet();

  function handleLogout() {
    if (wallet.connected) {
      wallet.disconnect();
    }
  }

  return (
    <IconButton onClick={handleLogout}>
      <i className="fad fa-sign-out" />
    </IconButton>
  );
}
