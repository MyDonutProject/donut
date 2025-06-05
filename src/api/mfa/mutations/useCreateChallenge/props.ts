import { CreateMfaChallengeDto } from "@/dto/mfa"
import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication/challenge"

export interface UseCreateChallengeOptionsProps {
  onExternalSuccess?: (
    challenge: MultiFactorAuthenticationChallenge,
    variables: CreateMfaChallengeDto
  ) => void
}
