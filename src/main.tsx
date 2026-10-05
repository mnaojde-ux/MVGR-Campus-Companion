import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept Google Maps API authorization and script errors gracefully
declare global {
  interface Window {
    gm_authFailure?: () => void;
    __googleMapsAuthError?: boolean;
  }
}

window.gm_authFailure = () => {
  window.__googleMapsAuthError = true;
  window.dispatchEvent(new CustomEvent('google-maps-auth-error'));
};

window.addEventListener('error', (event) => {
  const msg = String(event.message || '');
  const file = String(event.filename || '');
  if (
    msg.includes('ApiNotActivatedMapError') ||
    msg.includes('google.maps') ||
    file.includes('maps.googleapis.com') ||
    file.includes('maps.gstatic.com')
  ) {
    event.preventDefault();
    window.__googleMapsAuthError = true;
    window.dispatchEvent(new CustomEvent('google-maps-auth-error'));
    return true;
  }
});

createRoot(document.getElementById('root')!).render(<App />);
