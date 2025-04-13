import { useMutation } from "@tanstack/react-query";
import { fetchPrepareAccounts } from "./service";

export function usePrepareAccounts() {
  const { mutate, isPending } = useMutation({
    mutationFn: fetchPrepareAccounts,
  });

  return { mutate, isPending };
}
