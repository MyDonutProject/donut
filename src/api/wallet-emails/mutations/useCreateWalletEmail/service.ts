import { AxiosResponse } from "axios"
import { CreateWalletEmailInputDto } from "@/dto/wallet-emails/create-wallet-emails-input.dto"
import { WalletEmail } from "@/models/wallet/emails"
import baseAPI from "@/api"

export async function fetchCreateWalletEmail(
  data: CreateWalletEmailInputDto
): Promise<WalletEmail> {
  const response: AxiosResponse<WalletEmail> = await baseAPI.post(
    "/wallet-emails",
    data
  )

  return response.data
}
