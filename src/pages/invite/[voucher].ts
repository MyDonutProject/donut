import baseAPI from "@/api"
import { Nullable } from "@/interfaces/nullable"
import { ReferralVoucher } from "@/models/referral-vouchers"
import { GetServerSideProps } from "next"

export function InvitePage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const { voucher } = context.params as { voucher: string }

  const data: Nullable<ReferralVoucher> = await baseAPI.get(
    "/wallet-vouchers/by-voucher",
    {
      params: {
        voucher,
      },
    }
  )

  if (!data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: `?sponsor=${data?.wallet}`,
      permanent: false,
    },
  }
}
