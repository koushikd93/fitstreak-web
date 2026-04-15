// storage-polyfill.js
// Robust storage polyfill using IndexedDB (primary) + localStorage (fallback)
// IndexedDB is far more reliable on mobile browsers and WebViews
// Writes to BOTH for redundancy

(function () {
  if (window.storage) return;

  const DB_NAME = 'fitstreak-db';
  const STORE_NAME = 'kv';
  const DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      try {
        if (!window.indexedDB) {
          reject(new Error('IndexedDB not available'));
          return;
        }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
    return dbPromise;
  }

  async function idbGet(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSet(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function idbDelete(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function idbKeys() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function lsSet(key, v) { try { localStorage.setItem(key, v); return true; } catch { return false; } }
  function lsDelete(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }

  window.storage = {
    async get(key) {
      try {
        const val = await idbGet(key);
        if (val !== undefined && val !== null) {
          lsSet(key, val);
          return { key, value: val };
        }
      } catch {}
      const lsVal = lsGet(key);
      if (lsVal !== null) {
        try { await idbSet(key, lsVal); } catch {}
        return { key, value: lsVal };
      }
      return null;
    },
    async set(key, value) {
      const idbPromise = idbSet(key, value).catch(() => {});
      lsSet(key, value);
      await idbPromise;
      return { key, value };
    },
    async delete(key) {
      const idbPromise = idbDelete(key).catch(() => {});
      lsDelete(key);
      await idbPromise;
      return { key, deleted: true };
    },
    async list(prefix) {
      try {
        const allKeys = await idbKeys();
        const keys = prefix ? allKeys.filter(k => typeof k === 'string' && k.startsWith(prefix)) : allKeys;
        return { keys };
      } catch {
        const keys = [];
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!prefix || k.startsWith(prefix)) keys.push(k);
          }
        } catch {}
        return { keys };
      }
    }
  };

  openDB().catch(() => console.warn('[storage] IndexedDB unavailable'));
})();
