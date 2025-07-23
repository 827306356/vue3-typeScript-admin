enum CacheEnum {
  Local,
  Session
}
class Cache {
  storage: Storage;
  constructor(type: CacheEnum) {
    this.storage = type === CacheEnum.Local ? localStorage : sessionStorage;
  }
  get(key: string) {
    return this.storage.getItem(key);
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
  remove(key: string) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}

const LocalCache = new Cache(CacheEnum.Local);
const SessionCache = new Cache(CacheEnum.Session);

export { LocalCache, SessionCache };
