import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication"
import { QueryFunctionContext } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { UseMfaChallengeByIdQueryKeyProps } from "./props"
import baseAPI from "@/api"

export async function fetchMfaChallengeById({
  queryKey,
}: QueryFunctionContext<UseMfaChallengeByIdQueryKeyProps>): Promise<MultiFactorAuthenticationChallenge> {
  const id = queryKey[1]

  const response: AxiosResponse<MultiFactorAuthenticationChallenge> =
    await baseAPI.get<MultiFactorAuthenticationChallenge>(
      `/mfa/challenge/${id}`
    )

  return response.data
}
