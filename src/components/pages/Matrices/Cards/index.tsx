import styles from "./styles.module.scss"
import MatrixCard from "../Card"
import useTranslation from "next-translate/useTranslation"
import { useUserMatrices } from "@/api/matrices"
import { ErrorCard } from "@/components/core/ErrorCard"
import { useMemo } from "react"
import MatrixCardSkeleton from "../Card/Skeleton"

export default function Cards() {
  const { t } = useTranslation("common")
  const {
    data: userMatrices,
    isPending,
    error,
    refetch,
  } = useUserMatrices()

  const Matrices = useMemo(
    () =>
      userMatrices?.data?.map((matrix, index) => (
        <MatrixCard
          title={t("matrix_label", { slot: index + 1 })}
          slots={[...(matrix?.slots ?? []), null, null, null].slice(
            0,
            3
          )}
          status={matrix?.status}
        />
      )),
    [userMatrices?.data]
  )

  const Skeleton = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, index) => (
        <MatrixCardSkeleton key={`skeleton-${index}`} />
      )),
    []
  )

  if (error) {
    return <ErrorCard error={error} refetch={refetch} />
  }

  return (
    <div className={styles.container}>
      {isPending ? Skeleton : Matrices}
    </div>
  )
}
