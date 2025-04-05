import { Button } from "@/components/core/Button";
import useAccount from "@/hooks/account/useAccount";
import useBlockies from "@/hooks/blockies/useBlockies";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import { formatLargeString } from "@/utils/formatLargeString";
import useTranslation from "next-translate/useTranslation";
import styles from "./styles.module.scss";

export default function HeaderButton() {
  const { handleOpenAuthModal, isConnected, isSkeleton, address, status } =
    useAccount();
  const { isHomePage } = useIsHomePage();

  const blockies = useBlockies(address, {
    size: 4,
    scale: 6,
  });
  const { t } = useTranslation("common");

  if (!isConnected && status !== "connecting") {
    return (
      <Button
        useMaxContent
        // onClick={handleOpenAuthModal}
      >
        {t("comming_soon")}
        {/* {t('connect_wallet')} */}
      </Button>
    );
  }

  return (
    <Button
      useMaxContent
      isActive={isHomePage}
      isSecondary={!isHomePage}
      onClick={handleOpenAuthModal}
      isSkeleton={isSkeleton}
      className={isSkeleton ? styles.button__skeleton : ""}
    >
      <img src={blockies.toDataURL()} alt="avatar" className={styles.image} />
      {formatLargeString(address)}
    </Button>
  );
}
