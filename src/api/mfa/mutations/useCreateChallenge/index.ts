import { useMutation } from "@tanstack/react-query"
import { fetchCreateChallenge } from "./service"

export function useCreateChallenge() {
  const {
    mutateAsync: mutate,
    isPending,
    isError,
    data,
  } = useMutation({
    mutationFn: fetchCreateChallenge,
  })

  return {
    createChallenge: mutate,
    loadingCreateChallenge: isPending,
    isError,
    data,
  }
}
