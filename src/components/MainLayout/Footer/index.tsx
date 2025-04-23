import { Image } from "@/components/core/Image";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useMemo } from "react";
import LanguageButton from "../Language/Button";
import { paths } from "./paths";
import { socials } from "./socials";
import styles from "./styles.module.scss";

export default function Footer() {
  const { t } = useTranslation("common");
  const { isHomePage } = useIsHomePage();
  const Icons = useMemo(
    () =>
      socials.map((icon) => (
        <Link
          key={icon.icon}
          href={icon.url}
          className={styles.container__icon}
          target="_blank"
        >
          <i className={icon.icon} />
        </Link>
      )),
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <Image
          src="/donut/logo/logo-dark.avif"
          alt="logo"
          className={styles.container__logo}
        />
        <p className={styles.container__text}>
          {t("all_rights_reserved", { year: new Date().getFullYear() })}
        </p>
      </div>
      <div className={styles.container__wrapper}>
        <LanguageButton />
        {paths.map((path) => (
          <Link
            key={path.label}
            href={path.value}
            className={styles.container__link}
            target="_blank"
          >
            {t(path.label)}
          </Link>
        ))}
      </div>
      <div
        className={`${styles.container__wrapper} ${
          styles[`container__wrapper--smaller`]
        }`}
      >
        {Icons}
      </div>
    </div>
  );
}
