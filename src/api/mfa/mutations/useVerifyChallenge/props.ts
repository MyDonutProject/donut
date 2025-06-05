import { VerifyMfaChallengeDto } from "@/dto/mfa"
import { VerifyMultiFactorAuthenticationChallengeResult } from "@/models/multi-factor-authentication/challenge/result"

export interface UseVerifyChallengeOptionsProps {
  onExternalSuccess?: (
    challenge: VerifyMultiFactorAuthenticationChallengeResult,
    variables: VerifyMfaChallengeDto
  ) => void
}
