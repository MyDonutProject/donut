import { useRouter } from 'next/router';

export default function useIsHomePage() {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  return { isHomePage };
}
