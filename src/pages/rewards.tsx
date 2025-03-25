import { GetServerSidePropsResultWithMetadata } from '@/interfaces/pages/getServerSidePropsResultWithMetadata.interface';
import { generateMetadata } from '@/lib/metadata';
import { Language } from '@/enums/languageId';
import { GetServerSidePropsContext } from 'next';
import Rewards from '@/components/pages/Rewards';

export default function RewardsPage() {
  return <Rewards />;
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResultWithMetadata> {
  const metadata = await generateMetadata({
    lang: locale as Language,
    path: '/rewards',
    follow: false,
    isPrivate: true,
    i18nNamespace: 'seo',
    title: 'rewards_title',
    description: 'description',
  });

  return {
    props: {
      metadata: JSON.stringify(metadata),
    },
  };
}
