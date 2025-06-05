import { TableGridColumn } from "@/components/core/TableGrid/props"
import { WalletEmail } from "@/models/wallet/emails"
import { formatLargeString } from "@/utils/formatLargeString"
import DashboardVerifiedCell from "@/components/pages/Dashboard/Invite/Modal/Cell"

export const userEmailsColumns: TableGridColumn<WalletEmail>[] = [
  {
    field: "email",
    headerName: "email",
  },
  {
    field: "wallet",
    headerName: "wallet",
    valueFormatter: (email: WalletEmail) => {
      return formatLargeString(email.wallet?.address ?? "")
    },
  },
  {
    field: "verified",
    headerName: "verified",
    renderCell: (email: WalletEmail) => (
      <DashboardVerifiedCell email={email} />
    ),
  },
]
