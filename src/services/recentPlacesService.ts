/**
 * Recent Places Service
 * Persists and tracks actual campus locations interacted with by the student.
 */

const STORAGE_KEY = 'mvgr_recent_place_ids';

export const recentPlacesService = {
  getRecentPlaceIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Pre-seed initial recent locations for demonstration persona (Manoj / Arjun)
        const defaults = ['cse-block', 'central-library', 'main-gate'];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addRecentPlaceId(placeId: string): void {
    try {
      if (!placeId) return;
      const current = this.getRecentPlaceIds().filter((id) => id !== placeId);
      const updated = [placeId, ...current].slice(0, 5); // Keep at most 5 recents
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Fallback silently if storage unavailable
    }
  },

  clearRecentPlaces(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback silently
    }
  },
};
