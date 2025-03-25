export interface UseInfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  condition?: boolean;
  reverse?: boolean;
}
