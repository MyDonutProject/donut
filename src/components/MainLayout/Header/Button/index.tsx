import { IconButton } from "@/components/core/IconButton";
import { ModalsKey } from "@/enums/modalsKey";
import { useArmang } from "@/hooks/armang/useArmang";
import { useModal } from "@/hooks/modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

export default function HeaderButton() {
  const isMobile = useIsMobile();
  useArmang();
  const { isOpen } = useModal(ModalsKey.ProfileDetails);
  const { push, query } = useRouter();
  const wallet = useWallet();

  const byPass = !!query.bypass;

  function handleOpenProfile() {
    push({
      hash: ModalsKey.ProfileDetails,
    });
  }

  if (!byPass && !wallet.connected) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <WalletMultiButton />
        <IconButton onClick={handleOpenProfile}>
          <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </IconButton>
      </>
    );
  }

  return (
    <>
      <WalletMultiButton />
    </>
  );
}
