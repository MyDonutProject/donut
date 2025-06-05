import baseAPI from "@/api"
import { VerifyMfaChallengeDto } from "@/dto/mfa/verify-challenge.dto"
import { VerifyMultiFactorAuthenticationChallengeResult } from "@/models/multi-factor-authentication/challenge/result"

export async function fetchVerifyChallenge(
  dto: VerifyMfaChallengeDto
): Promise<VerifyMultiFactorAuthenticationChallengeResult> {
  const response =
    await baseAPI.post<VerifyMultiFactorAuthenticationChallengeResult>(
      "/mfa/challenge/verify",
      dto
    )

  return response.data
}
