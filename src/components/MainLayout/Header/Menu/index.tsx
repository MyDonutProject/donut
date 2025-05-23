import { StaggerAnimation } from "@/components/core/Animation/Stagger";
import pages from "@/constants/pages";
import useAccount from "@/hooks/account/useAccount";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRouter } from "next/router";
import { useMemo } from "react";
import HeaderMenuItem from "./Item";
import styles from "./styles.module.scss";

export default function HeaderMenu() {
  const { isConnected } = useAccount();
  const { pathname } = useRouter();
  const isMobile = useIsMobile();

  const Items = useMemo(
    () =>
      pages.map((page) => (
        <HeaderMenuItem item={page} isActive={pathname.includes(page.path)} />
      )),
    [pathname]
  );

  if (!isConnected || isMobile) {
    return null;
  }

  return (
    <StaggerAnimation
      direction="row"
      stagger={0.1}
      staggerDirection="up"
      className={styles.container}
    >
      {Items}
    </StaggerAnimation>
  );
}
