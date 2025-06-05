import { AxiosResponse } from "axios"
import { WalletEmail } from "@/models/wallet/emails"
import baseAPI from "@/api"
import { VerifyWalletEmailInputDto } from "@/dto/wallet-emails/verify-user-email-input.dto"

export async function fetchVerifyWalletEmail({
  challengeId,
  ...data
}: VerifyWalletEmailInputDto): Promise<WalletEmail> {
  const response: AxiosResponse<WalletEmail> = await baseAPI.patch(
    "/wallet-emails",
    data,
    {
      headers: {
        "x-challenge-id": challengeId,
      },
    }
  )

  return response.data
}
