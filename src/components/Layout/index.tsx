import { LayoutProps } from "./props";
import styles from "./styles.module.scss";

import useIsAffiliatesPage from "@/hooks/layout/useIsAffiliatesPage";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import useIsRewardsPage from "@/hooks/layout/useIsRewardsPage";
import useTranslation from "next-translate/useTranslation";
import { PropsWithChildren } from "react";
import Footer from "../MainLayout/Footer";

function Layout({
  title,
  titleComponent,
  actionComponent,
  children,
  largerContainer = false,
  titleClassName,
}: PropsWithChildren<LayoutProps>) {
  const { t } = useTranslation("common");
  const { isHomePage } = useIsHomePage();
  const { isAffiliatesPage } = useIsAffiliatesPage();
  const { isRewardsPage } = useIsRewardsPage();

  return (
    <>
      <div
        className={`${styles.container} ${
          !isHomePage && !isRewardsPage ? styles["container--navigation"] : ""
        } ${isAffiliatesPage ? styles["container--affiliates"] : ""}`}
      >
        <div
          className={`${styles.content} ${
            largerContainer ? styles["content--larger"] : ""
          }`}
        >
          <div className={styles.content__row}>
            {title && (
              <div
                className={`${styles.title} ${
                  titleClassName ? titleClassName : ""
                }`}
              >
                {t(title)}
              </div>
            )}
            {!title && titleComponent}
            {actionComponent}
          </div>
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
