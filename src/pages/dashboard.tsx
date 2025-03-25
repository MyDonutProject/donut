import { GetServerSidePropsResultWithMetadata } from '@/interfaces/pages/getServerSidePropsResultWithMetadata.interface';
import { generateMetadata } from '@/lib/metadata';
import { Language } from '@/enums/languageId';
import { GetServerSidePropsContext } from 'next';
import Dashboard from '@/components/pages/Dashboard';

export default function DashboardPage() {
  return <Dashboard />;
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResultWithMetadata> {
  const metadata = await generateMetadata({
    lang: locale as Language,
    path: '/dashboard',
    follow: false,
    isPrivate: true,
    i18nNamespace: 'seo',
    title: 'dashboard_title',
    description: 'description',
  });

  return {
    props: {
      metadata: JSON.stringify(metadata),
    },
  };
}
