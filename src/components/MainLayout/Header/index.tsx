import styles from './styles.module.scss';
import LanguageButton from '../Language/Button';
import Link from '@/components/core/Link';
import HeaderButton from './Button';
import HeaderMenu from './Menu';
import useIsHomePage from '@/hooks/layout/useIsHomePage';

function Header() {
  const { isHomePage } = useIsHomePage();

  return (
    <div
      className={`${styles.container} ${!isHomePage ? styles['container--navigation'] : ''}`}
    >
      <span className={styles.container__wrapper}>
        <Link href={'/'}>
          <img
            className={styles.container__logo}
            alt="Logo"
            src="/donut/logo/logo.png"
          />
        </Link>
        <HeaderMenu />
        <div className={styles.container__row}>
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
