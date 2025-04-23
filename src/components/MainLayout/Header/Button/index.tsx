import { IconButton } from "@/components/core/IconButton";
import { ModalsKey } from "@/enums/modalsKey";
import { useArmang } from "@/hooks/armang/useArmang";
import { useModal } from "@/hooks/modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

export default function HeaderButton() {
  const isMobile = useIsMobile();
  useArmang();
  const { isOpen } = useModal(ModalsKey.ProfileDetails);
  const { push } = useRouter();

  function handleOpenProfile() {
    push({
      hash: ModalsKey.ProfileDetails,
    });
  }

  if (isMobile) {
    return (
      <>
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
