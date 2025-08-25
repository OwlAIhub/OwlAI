import { STORAGE_KEYS } from "@/constants";

export interface PersistenceOptions {
  prefix?: string;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  storage?: Storage;
  version?: number;
  migrate?: (oldData: any, oldVersion: number) => any;
}

const defaultOptions: Required<PersistenceOptions> = {
  prefix: "owlai_",
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  storage:
    typeof window !== "undefined" ? window.localStorage : ({} as Storage),
  version: 1,
  migrate: data => data,
};

class PersistenceManager {
  private options: Required<PersistenceOptions>;

  constructor(options: PersistenceOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  private getKey(key: string): string {
    return `${this.options.prefix}${key}`;
  }

  private getVersionKey(key: string): string {
    return `${this.getKey(key)}_version`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = this.options.serialize(value);
      this.options.storage.setItem(this.getKey(key), serialized);
      this.options.storage.setItem(
        this.getVersionKey(key),
        String(this.options.version)
      );
    } catch (error) {
      console.error(`Failed to persist data for key "${key}":`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const serialized = this.options.storage.getItem(this.getKey(key));
      if (serialized === null) return null;

      const storedVersion = this.options.storage.getItem(
        this.getVersionKey(key)
      );
      const version = storedVersion ? parseInt(storedVersion, 10) : 1;

      let data = this.options.deserialize(serialized);

      // Apply migration if needed
      if (version < this.options.version) {
        data = this.options.migrate(data, version);
        // Update storage with migrated data
        this.set(key, data);
      }

      return data;
    } catch (error) {
      console.error(`Failed to retrieve data for key "${key}":`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      this.options.storage.removeItem(this.getKey(key));
      this.options.storage.removeItem(this.getVersionKey(key));
    } catch (error) {
      console.error(`Failed to remove data for key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < this.options.storage.length; i++) {
        const key = this.options.storage.key(i);
        if (key && key.startsWith(this.options.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        this.options.storage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear persisted data:", error);
    }
  }

  exists(key: string): boolean {
    return this.options.storage.getItem(this.getKey(key)) !== null;
  }

  size(): number {
    let count = 0;
    try {
      for (let i = 0; i < this.options.storage.length; i++) {
        const key = this.options.storage.key(i);
        if (
          key &&
          key.startsWith(this.options.prefix) &&
          !key.endsWith("_version")
        ) {
          count++;
        }
      }
    } catch (error) {
      console.error("Failed to calculate storage size:", error);
    }
    return count;
  }
}

// Create singleton instances
export const localStorage = new PersistenceManager({
  storage:
    typeof window !== "undefined" ? window.localStorage : ({} as Storage),
  version: 1,
});

export const sessionStorage = new PersistenceManager({
  storage:
    typeof window !== "undefined" ? window.sessionStorage : ({} as Storage),
  prefix: "owlai_session_",
  version: 1,
});

// Secure storage for sensitive data (uses encryption if available)
export const secureStorage = new PersistenceManager({
  storage:
    typeof window !== "undefined" ? window.localStorage : ({} as Storage),
  prefix: "owlai_secure_",
  serialize: value => {
    // Basic obfuscation - in production, use proper encryption
    return btoa(JSON.stringify(value));
  },
  deserialize: value => {
    // Basic deobfuscation
    return JSON.parse(atob(value));
  },
  version: 1,
});

// Persistence hooks
export const usePersistence = () => {
  return {
    localStorage,
    sessionStorage,
    secureStorage,
  };
};

// Store hydration utilities
export const hydrateStore = <T>(
  storageKey: string,
  defaultValue: T,
  storage: PersistenceManager = localStorage
): T => {
  const stored = storage.get<T>(storageKey);
  return stored !== null ? stored : defaultValue;
};

export const persistStore = <T>(
  storageKey: string,
  data: T,
  storage: PersistenceManager = localStorage
): void => {
  storage.set(storageKey, data);
};

// Clear all app data
export const clearAllData = (): void => {
  localStorage.clear();
  sessionStorage.clear();
  secureStorage.clear();

  // Also clear any additional storage keys
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear key "${key}":`, error);
    }
  });
};

// Export for backward compatibility
export const storage = localStorage;
