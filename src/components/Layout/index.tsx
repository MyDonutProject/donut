import styles from './styles.module.scss';
import { LayoutProps } from './props';

import { PropsWithChildren } from 'react';
import useIsHomePage from '@/hooks/layout/useIsHomePage';
import useIsAffiliatesPage from '@/hooks/layout/useIsAffiliatesPage';
import useTranslation from 'next-translate/useTranslation';
import Footer from '../MainLayout/Footer';

function Layout({
  title,
  titleComponent,
  actionComponent,
  children,
  largerContainer = false,
  titleClassName,
}: PropsWithChildren<LayoutProps>) {
  const { t } = useTranslation('common');
  const { isHomePage } = useIsHomePage();
  const { isAffiliatesPage } = useIsAffiliatesPage();
  return (
    <>
      <div
        className={`${styles.container} ${!isHomePage ? styles['container--navigation'] : ''} ${isAffiliatesPage ? styles['container--affiliates'] : ''}`}
      >
        <div
          className={`${styles.content} ${largerContainer ? styles['content--larger'] : ''}`}
        >
          <div className={styles.content__row}>
            {title && (
              <div
                className={`${styles.title} ${titleClassName ? titleClassName : ''}`}
              >
                {t(title)}
              </div>
            )}
            {!title && titleComponent}
            {actionComponent}
          </div>
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;
