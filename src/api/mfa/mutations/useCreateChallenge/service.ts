import baseAPI from "@/api"
import { CreateMfaChallengeDto } from "@/dto/mfa/create-mfa-challenge.dto"
import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication/challenge"

export async function fetchCreateChallenge(
  dto: CreateMfaChallengeDto
): Promise<MultiFactorAuthenticationChallenge> {
  const response =
    await baseAPI.post<MultiFactorAuthenticationChallenge>(
      "/mfa/challenge",
      dto
    )

  return response.data
}
