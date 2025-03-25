export function formatLargeString(value: string): string {
  return `${value?.substring(0, 6)}...${value?.substring(value?.length - 4)}`;
}
