import { GetServerSidePropsResultWithMetadata } from '@/interfaces/pages/getServerSidePropsResultWithMetadata.interface';
import { generateMetadata } from '@/lib/metadata';
import { Language } from '@/enums/languageId';
import { GetServerSidePropsContext } from 'next';
import Home from '@/components/pages/Home';

export default function HomePage() {
  return <Home />;
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResultWithMetadata> {
  const metadata = await generateMetadata({
    lang: locale as Language,
    path: '/',
    i18nNamespace: 'seo',
    title: 'title',
    description: 'description',
  });

  return {
    props: {
      metadata: JSON.stringify(metadata),
    },
  };
}
