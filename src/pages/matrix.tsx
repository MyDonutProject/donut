import { GetServerSidePropsResultWithMetadata } from '@/interfaces/pages/getServerSidePropsResultWithMetadata.interface';
import { generateMetadata } from '@/lib/metadata';
import { Language } from '@/enums/languageId';
import { GetServerSidePropsContext } from 'next';
import Matrices from '@/components/pages/Matrices';

export default function MatricesPage() {
  return <Matrices />;
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResultWithMetadata> {
  const metadata = await generateMetadata({
    lang: locale as Language,
    path: '/matrices',
    follow: false,
    isPrivate: true,
    i18nNamespace: 'seo',
    title: 'matrix_title',
    description: 'description',
  });

  return {
    props: {
      metadata: JSON.stringify(metadata),
    },
  };
}
