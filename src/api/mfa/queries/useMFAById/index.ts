import { Query, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect } from "react"
import { MFAQueryKeys } from "../../queryKey"
import {
  UseMfaChallengeByIdOptionsProps,
  UseMfaChallengeByIdQueryKeyProps,
} from "./props"
import { fetchMfaChallengeById } from "./service"
import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication"
import { GenericError } from "@/models/generic-error"
import { MultiFactorAuthenticationChallengeStatusId } from "@/models/multi-factor-authentication/challenge/statuses/id"

export function useMfaChallengeById(
  options?: UseMfaChallengeByIdOptionsProps
) {
  const { id, onSuccess } = options ?? {}

  const queryKey: UseMfaChallengeByIdQueryKeyProps = [
    MFAQueryKeys.ById,
    id,
  ]

  const { data, isPending, error, refetch, fetchStatus } = useQuery<
    MultiFactorAuthenticationChallenge,
    AxiosError<GenericError>,
    MultiFactorAuthenticationChallenge,
    UseMfaChallengeByIdQueryKeyProps
  >({
    queryKey,
    queryFn: fetchMfaChallengeById,
    enabled: !!id,
    refetchInterval: (
      query: Query<
        MultiFactorAuthenticationChallenge,
        AxiosError<GenericError>,
        MultiFactorAuthenticationChallenge,
        UseMfaChallengeByIdQueryKeyProps
      >
    ) => {
      const data = query?.state?.data

      if (
        data?.statusId.toString() ===
        MultiFactorAuthenticationChallengeStatusId.Pending.toString()
      ) {
        return 2 * 1000
      }

      return false
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  })

  function handleSuccess() {
    if (
      data?.statusId?.toString() ===
      MultiFactorAuthenticationChallengeStatusId.Verified.toString()
    ) {
      onSuccess?.(data)
    }
  }

  useEffect(handleSuccess, [data])

  return {
    error,
    refetch,
    isPending: isPending && fetchStatus !== "idle",
    challenge: data,
  }
}
