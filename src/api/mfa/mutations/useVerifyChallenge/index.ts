import { useMutation } from "@tanstack/react-query"
import { fetchVerifyChallenge } from "./service"

export function useVerifyChallenge() {
  const {
    mutateAsync: mutate,
    isPending,
    isError,
    data,
  } = useMutation({
    mutationFn: fetchVerifyChallenge,
  })

  return {
    verifyChallenge: mutate,
    loadingVerifyChallenge: isPending,
    isError,
    data,
  }
}
