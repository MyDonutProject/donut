export function areObjectValuesDifferent<
  T extends Record<string, any>
>(obj1: T, obj2: T): boolean {
  for (const key of Object.keys(obj1)) {
    if (obj1[key] !== obj2[key]) {
      return true
    }
  }

  return false
}
