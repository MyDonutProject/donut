export class LocalStorageService {
  static getLocalStorageItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) {
      return null;
    }

    return JSON.parse(item);
  }

  static setLocalStorageItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
