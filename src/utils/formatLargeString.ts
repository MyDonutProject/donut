export function formatLargeString(value: string): string {
  if (value.length <= 10) {
    return value;
  }

  return `${value?.substring(0, 6)}...${value?.substring(value?.length - 4)}`;
}
