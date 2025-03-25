import NotificationToasty from '../Notifications/Toasty';
import Header from './Header';
import LanguageModal from './Language/Modal';
import ProfileDrawer from '../Profile/Drawer';
import Layout from '../Layout';
import { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <NotificationToasty />
      <LanguageModal />
      <Header />
      <ProfileDrawer />
      <Layout>{children}</Layout>
    </>
  );
}
