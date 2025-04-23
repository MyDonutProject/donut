import { Input } from "@/components/core/Input";
import Link from "@/components/core/Link";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import { formatLargeString } from "@/utils/formatLargeString";
import { Tooltip } from "@mui/material";
import { getCookie } from "cookies-next/client";
import useTranslation from "next-translate/useTranslation";
import HeaderButton from "./Button";
import HeaderMenu from "./Menu";
import styles from "./styles.module.scss";

function Header() {
  const { isHomePage } = useIsHomePage();
  const { t } = useTranslation("common");

  const sponsorCode = getCookie("sponsor");
  const formattedSponsorCode = formatLargeString(sponsorCode);

  return (
    <div
      className={`${styles.container} ${
        !isHomePage ? styles["container--navigation"] : ""
      }`}
    >
      <span className={styles.container__wrapper}>
        <Link href={"/"}>
          <img
            className={`${styles.container__logo} desktop-only`}
            alt="Logo"
            src={
              isHomePage ? "/donut/logo/logo.png" : "/donut/logo/logo-dark.avif"
            }
          />
          <img
            className={`${styles.container__logo} mobile-only`}
            alt="Logo"
            src={
              isHomePage ? "/donut/logo/logo.png" : "/donut/logo/logo-dark.avif"
            }
          />
        </Link>
        <HeaderMenu />
        <div className={styles.container__row}>
          {!!sponsorCode && (
            <Tooltip title={t("sponsor_label")}>
              <Input
                placeholder="Sponsor Code"
                value={formattedSponsorCode}
                readOnly
                style={{
                  minWidth: "150px",
                }}
              />
            </Tooltip>
          )}
          <HeaderButton />
        </div>
      </span>
    </div>
  );
}

export default Header;
