import { AccountQueryKeys } from "@/api/account/queryKeys";
import { ContractQueryKeys } from "@/api/contracts/queryKeys";
import { TransactionQueryKeys } from "@/api/transactions/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPrepareAccounts } from "./service";

export function usePrepareAccounts() {
  const queryClient = useQueryClient();

  function onSuccess() {
    queryClient.invalidateQueries({
      queryKey: [AccountQueryKeys.UserAccount],
    });
    queryClient.invalidateQueries({
      queryKey: [ContractQueryKeys.REFERRER_TOKEN_ACCOUNT],
    });
    queryClient.invalidateQueries({
      queryKey: [TransactionQueryKeys.Transaction],
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: fetchPrepareAccounts,
    onSuccess,
  });

  return { mutate, isPending };
}
