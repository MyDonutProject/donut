import styles from "./styles.module.scss";

import { StaggerAnimation } from "@/components/core/Animation/Stagger";
import { Image } from "@/components/core/Image";
import TransText from "next-translate/Trans";
import { useMemo } from "react";
import BuyHere from "./BuyHere";
import CommunityDriven from "./CommunityDriven";
import HomeSection from "./Section";
import Table from "./Table";

export default function Home() {
  const Images = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => (
        <Image
          src={"/donut/assets/donut.png"}
          className={`${styles.container__detail} ${
            styles[`container__detail--${index + 1}`]
          }`}
          alt={`donut-${index + 1}`}
          fetchPriority="low"
          loading="lazy"
        />
      )),
    []
  );

  return (
    <>
      <div className={styles.container}>
        {Images}
        <StaggerAnimation
          direction="column"
          stagger={0.1}
          staggerDirection="up"
          className={styles.container__content}
        >
          <h1 className={styles.container__title}>
            <TransText
              i18nKey="common:how_to_buy"
              components={{
                strong: <strong />,
              }}
            />
          </h1>
          {/* <HomeContractAddress /> */}
          <BuyHere />
          <CommunityDriven />
          {/* <ConnectWalletButton /> */}
        </StaggerAnimation>
      </div>
      <HomeSection />
      <Table />
    </>
  );
}
