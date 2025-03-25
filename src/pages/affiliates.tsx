import { GetServerSidePropsResultWithMetadata } from '@/interfaces/pages/getServerSidePropsResultWithMetadata.interface';
import { generateMetadata } from '@/lib/metadata';
import { Language } from '@/enums/languageId';
import { GetServerSidePropsContext } from 'next';
import Affiliates from '@/components/pages/Affiliates';

export default function AffiliatesPage() {
  return <Affiliates />;
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResultWithMetadata> {
  const metadata = await generateMetadata({
    lang: locale as Language,
    path: '/affiliates',
    follow: false,
    isPrivate: true,
    i18nNamespace: 'seo',
    title: 'affiliates_title',
    description: 'description',
  });

  return {
    props: {
      metadata: JSON.stringify(metadata),
    },
  };
}
