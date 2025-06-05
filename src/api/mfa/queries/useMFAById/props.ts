import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication"
import { MFAQueryKeys } from "../../queryKey"

export type UseMfaChallengeByIdQueryKeyProps = [
  MFAQueryKeys.ById,
  string
]

export interface UseMfaChallengeByIdOptionsProps {
  id?: string
  onSuccess?: (challenge: MultiFactorAuthenticationChallenge) => void
}
