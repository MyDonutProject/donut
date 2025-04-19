import { Input } from "@/components/core/Input";
import Link from "@/components/core/Link";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import { formatLargeString } from "@/utils/formatLargeString";
import { Tooltip } from "@mui/material";
import { getCookie, hasCookie } from "cookies-next/client";
import useTranslation from "next-translate/useTranslation";
import LanguageButton from "../Language/Button";
import HeaderButton from "./Button";
import HeaderMenu from "./Menu";
import styles from "./styles.module.scss";

function Header() {
  const { isHomePage } = useIsHomePage();
  const { t } = useTranslation("common");
  return (
    <div
      className={`${styles.container} ${
        !isHomePage ? styles["container--navigation"] : ""
      }`}
    >
      <span className={styles.container__wrapper}>
        <Link href={"/"}>
          <img
            className={styles.container__logo}
            alt="Logo"
            src="/donut/logo/logo.png"
          />
        </Link>
        <HeaderMenu />
        <div className={styles.container__row}>
          {hasCookie("sponsor") && (
            <Tooltip title={t("sponsor_label")}>
              <Input
                placeholder="Sponsor Code"
                value={formatLargeString(getCookie("sponsor"))}
                readOnly
              />
            </Tooltip>
          )}
          <HeaderButton />
          <div className="desktop-only">
            <LanguageButton />
          </div>
        </div>
      </span>
    </div>
  );
}

export default Header;
