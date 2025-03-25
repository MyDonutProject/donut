import { useRouter } from 'next/router';

export default function useIsAffiliatesPage() {
  const router = useRouter();
  const isAffiliatesPage = router.pathname === '/affiliates';
  return { isAffiliatesPage };
}
