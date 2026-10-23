// Cookie-notice consent in localStorage (same key/value as the old site).
// Storage can throw (private mode, blocked storage), so every access is guarded.
const KEY = 'cookiesAccepted';

export function createConsentStore(storage) {
  return {
    isAccepted() {
      try {
        return storage?.getItem(KEY) === 'true';
      } catch {
        return false;
      }
    },
    accept() {
      try {
        storage?.setItem(KEY, 'true');
      } catch {
        // Ignore: notice just hides for this visit.
      }
    },
  };
}
