/**
 * Google Maps Configuration for MVGR Campus Companion
 * Verified coordinates for MVGR College of Engineering, Vizianagaram.
 * Reference: https://maps.app.goo.gl/xMEEr52rYsMbDWyK8
 */

export const getGoogleMapsApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('mvgr_custom_maps_api_key');
    if (override && override.trim()) {
      return override.trim();
    }
  }

  return (
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    'AIzaSyD4CvcIxlE-VVhZR0PQkli_NwHHsw23wis'
  );
};

export const setCustomGoogleMapsApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('mvgr_custom_maps_api_key', key.trim());
    } else {
      localStorage.removeItem('mvgr_custom_maps_api_key');
    }
  }
};

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();

export const MVGR_CAMPUS_COORDINATES = {
  lat: 18.060178,
  lng: 83.405580,
  defaultZoom: 17,
  selectedZoom: 18,
};
