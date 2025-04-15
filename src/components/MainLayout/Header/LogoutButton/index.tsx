import { IconButton } from "@/components/core/IconButton";
import useTranslation from "next-translate/useTranslation";

export default function LogoutButton() {
  const { t } = useTranslation("common");

  function handleLogout() {}

  return (
    <IconButton onClick={handleLogout}>
      <i className="fad fa-sign-out" />
    </IconButton>
  );
}
