export interface Comparator<T> {
  (o1: T, o2: T): number;
}
