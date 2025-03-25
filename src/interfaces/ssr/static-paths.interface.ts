export interface StaticPathsProps<T extends string> {
  params: {
    [key in T]: string;
  };
  locale: string;
}
