import { AxiosResponse } from "axios"
import { ReferralVoucher } from "@/models/referral-vouchers"
import baseAPI from "@/api"
import { CreateVoucherDto } from "@/dto/referral-voucher/create-referral-voucher-input.dto"

export async function fetchCreateReferralVoucher(
  data: CreateVoucherDto
): Promise<ReferralVoucher> {
  const response: AxiosResponse<ReferralVoucher> = await baseAPI.post(
    "/wallet-vouchers",
    data
  )

  return response.data
}
