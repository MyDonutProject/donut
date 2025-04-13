import { WalletButton } from "@/providers/Solana";
import useTranslation from "next-translate/useTranslation";

export default function HeaderButton() {
  const { t } = useTranslation("common");

  return <WalletButton></WalletButton>;
}
