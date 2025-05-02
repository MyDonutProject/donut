import LogoutButton from "@/components/MainLayout/Header/LogoutButton";
import { StaggerAnimation } from "@/components/core/Animation/Stagger";
import ProfileDrawerContentNavigation from "./Navigation/Common";
import styles from "./styles.module.scss";

export default function ProfileDrawerContent() {
  return (
    <div className={styles.container}>
      <StaggerAnimation
        direction="column"
        stagger={0.15}
        staggerDirection="up"
        className={styles.container__content}
      >
        <ProfileDrawerContentNavigation />
        {/* <ProfileDrawerContentNavigationSettings /> */}
        <LogoutButton />
      </StaggerAnimation>
    </div>
  );
}
