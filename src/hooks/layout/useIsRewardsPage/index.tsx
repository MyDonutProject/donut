import { useRouter } from "next/router";

export default function useIsRewardsPage() {
  const router = useRouter();
  const isRewardsPage = router.pathname === "/rewards";
  return { isRewardsPage };
}
