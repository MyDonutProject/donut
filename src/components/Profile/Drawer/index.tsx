import { PageDrawer } from "@/components/core/PageDrawer";
import { ModalsKey } from "@/enums/modalsKey";
import { useModal } from "@/hooks/modal";
import useTranslation from "next-translate/useTranslation";
import ProfileDrawerContent from "./Content";

export default function ProfileDrawer() {
  const { t } = useTranslation("common");
  const { isOpen, onClose } = useModal(ModalsKey.ProfileDetails);

  function handleClose() {
    onClose();
  }

  return (
    <PageDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={t("profile_label")}
    >
      <ProfileDrawerContent />
    </PageDrawer>
  );
}
