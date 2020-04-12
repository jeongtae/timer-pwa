export default {
  get<T>(key: string, fallback: T): T {
    try {
      const json = window.localStorage.getItem(key);
      if (json == null) {
        return fallback;
      }
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: any): boolean {
    try {
      const json = JSON.stringify(value);
      window.localStorage.setItem(key, json);
      return true;
    } catch {
      return false;
    }
  }
};
