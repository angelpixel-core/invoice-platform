export interface Cache {
  /**
   * Retrieve a value from caché by its key.
   * Return `null` if the key not exists or is expired.
   *
   * @template T Type expected from stored data.
   * @param key Search's key.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value in the caché with a optional lisegundosve time (TTL).
   *
   * @template T Value's type to store.
   * @param key Uniq storing key.
   * @param value Value to store (it will be serialized if is required).
   * @param ttlSeconds Live time in seconds (optional).
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Erase a key from caché.
   *
   * @param key Key to erase.
   */
  del(key: string): Promise<void>;

  /**
   * Erase multiple keys that matchs with a patter or prefix.
   * Useful for massive invalidations (i.e. "invoices:search:tenant-123:*").
   *
   * @param pattern Search's pattern.
   */
  delByPattern?(pattern: string): Promise<void>;
}
