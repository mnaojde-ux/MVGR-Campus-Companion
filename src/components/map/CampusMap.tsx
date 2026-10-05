import React, { useState, useMemo, useEffect } from 'react';
import { 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { 
  Search, 
  Layers, 
  Crosshair, 
  Navigation, 
  MapPin, 
  Building, 
  Compass, 
  CheckCircle2, 
  X,
  AlertTriangle,
  RotateCcw,
  Footprints,
  Info,
  Key,
  ExternalLink
} from 'lucide-react';
import { 
  CampusPlace, 
  CAMPUS_PLACES, 
  CATEGORY_LIST, 
  CampusCategory, 
  MVGR_CAMPUS_CENTER,
} from '../../data/campusPlaces';
import { 
  GOOGLE_MAPS_API_KEY, 
  MVGR_CAMPUS_COORDINATES, 
  setCustomGoogleMapsApiKey 
} from '../../config/mapsConfig';
import { recentPlacesService } from '../../services/recentPlacesService';
import { MapBottomSheet } from './MapBottomSheet';
import { NavigationRouteView } from './NavigationRouteView';
import { PlaceDetailsModal } from './PlaceDetailsModal';
import { VectorMapFallback } from './VectorMapFallback';

interface CampusMapProps {
  initialPlaceId?: string | null;
  onClearInitialPlace?: () => void;
}

// Smooth camera controller for panning and zooming to places
function MapCameraController({ targetPlace }: { targetPlace: CampusPlace | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetPlace) return;
    map.panTo({ lat: targetPlace.latitude, lng: targetPlace.longitude });
    map.setZoom(MVGR_CAMPUS_COORDINATES.selectedZoom);
  }, [map, targetPlace]);

  return null;
}

export const CampusMap: React.FC<CampusMapProps> = ({ 
  initialPlaceId,
  onClearInitialPlace 
}) => {
  const loadingStatus = useApiLoadingStatus();
  const [hasAuthError, setHasAuthError] = useState<boolean>(() => {
    return Boolean(typeof window !== 'undefined' && window.__googleMapsAuthError);
  });

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<CampusPlace | null>(null);
  const [detailedPlace, setDetailedPlace] = useState<CampusPlace | null>(null);
  const [activeNavigationDestination, setActiveNavigationDestination] = useState<CampusPlace | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Listen for Google Maps authorization failure (ApiNotActivatedMapError)
  useEffect(() => {
    const handleAuthError = () => {
      setHasAuthError(true);
    };

    window.addEventListener('google-maps-auth-error', handleAuthError);
    return () => {
      window.removeEventListener('google-maps-auth-error', handleAuthError);
    };
  }, []);

  // Update error state if vis.gl detects auth failure
  useEffect(() => {
    if (loadingStatus === APILoadingStatus.AUTH_FAILURE || loadingStatus === APILoadingStatus.FAILED) {
      setHasAuthError(true);
    }
  }, [loadingStatus]);

  // Controlled Demo Location presets for freshers like Arjun
  const DEMO_LOCATIONS = [
    { label: 'MVGR Main Gate (Bus Drop)', lat: 18.061650, lng: 83.403950 },
    { label: 'BS&H (1st Year Foyer)', lat: 18.060420, lng: 83.404650 },
    { label: 'Admin Lawn Quadrangle', lat: 18.060680, lng: 83.405150 },
    { label: 'CSE Department Plaza', lat: 18.060950, lng: 83.406250 },
  ];

  const [currentOrigin, setCurrentOrigin] = useState(DEMO_LOCATIONS[0]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Automatically select location when passed from Timetable, Exams, or Home
  useEffect(() => {
    if (initialPlaceId) {
      const match = CAMPUS_PLACES.find((p) => p.id === initialPlaceId);
      if (match) {
        setSelectedPlace(match);
      }
    }
  }, [initialPlaceId]);

  // Search and Category filtering
  const filteredPlaces = useMemo(() => {
    return CAMPUS_PLACES.filter((place) => {
      const matchCategory = selectedCategory === 'All' || place.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = place.name.toLowerCase().includes(q);
      const inDesc = place.description.toLowerCase().includes(q);
      const inBuilding = place.building?.toLowerCase().includes(q);
      const inRoom = place.room?.toLowerCase().includes(q);
      const inKeywords = place.keywords?.some((k) => k.toLowerCase().includes(q));

      return inName || inDesc || inBuilding || inRoom || inKeywords;
    });
  }, [selectedCategory, searchQuery]);

  // Haversine distance formula (in meters)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const selectedPlaceDistance = useMemo(() => {
    if (!selectedPlace) return null;
    return calculateDistance(
      currentOrigin.lat,
      currentOrigin.lng,
      selectedPlace.latitude,
      selectedPlace.longitude
    );
  }, [selectedPlace, currentOrigin]);

  // Estimated walking time: ~75 meters per minute pace
  const selectedPlaceWalkingMinutes = useMemo(() => {
    if (selectedPlaceDistance === null) return null;
    return Math.max(1, Math.ceil(selectedPlaceDistance / 75));
  }, [selectedPlaceDistance]);

  const handleSelectPlace = (place: CampusPlace) => {
    setSelectedPlace(place);
    setIsSearchFocused(false);
    recentPlacesService.addRecentPlaceId(place.id);
  };

  const toggleSatellite = () => {
    setMapType((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'));
  };

  const handleSaveCustomKey = () => {
    if (customKeyInput.trim()) {
      setCustomGoogleMapsApiKey(customKeyInput.trim());
      window.location.reload();
    }
  };

  // Google Maps is considered active ONLY when key is present, SDK loaded, and NO auth/activation errors
  const isGoogleMapsActive = 
    Boolean(GOOGLE_MAPS_API_KEY) && 
    loadingStatus === APILoadingStatus.LOADED && 
    !hasAuthError;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-100 select-none">
      {/* 1. TOP SEARCH & CATEGORY BAR */}
      <div className="absolute top-2.5 left-3 right-3 z-30 space-y-2 pointer-events-auto max-w-md mx-auto">
        <div className="relative shadow-md rounded-xl bg-white border border-slate-200">
          <div className="flex items-center px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search MVGR campus (CSE, ECE, Library, Admin...)"
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-40 divide-y divide-slate-100">
              {filteredPlaces.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  No matching campus location found.
                </div>
              ) : (
                filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {place.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {place.category} {place.building ? `• ${place.building}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                      Locate
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {CATEGORY_LIST.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border shadow-xs ${
                  isActive
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FLOATING MAP CONTROLS */}
      <div className="absolute top-28 right-3 z-30 flex flex-col gap-2">
        {isGoogleMapsActive && (
          <button
            onClick={toggleSatellite}
            className={`p-2.5 rounded-xl shadow-md border transition-all ${
              mapType === 'hybrid'
                ? 'bg-blue-900 text-white border-blue-950'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Satellite"
            aria-label="Toggle Satellite"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setShowLocationPicker((prev) => !prev)}
          className="p-2.5 bg-white text-blue-900 rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 transition-all relative"
          title="Change Demo Starting Location"
          aria-label="Demo Location"
        >
          <Crosshair className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {hasAuthError && (
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="p-2.5 bg-amber-50 text-amber-800 rounded-xl shadow-md border border-amber-300 hover:bg-amber-100 transition-all"
            title="Maps API Settings"
            aria-label="API Settings"
          >
            <Key className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Demo Location Picker Dropdown */}
      {showLocationPicker && (
        <div className="absolute top-44 right-3 z-30 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 text-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1.5 font-bold text-slate-800">
            <span>Demo Location: You are here</span>
            <button onClick={() => setShowLocationPicker(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">Simulate starting from key campus entrance spots:</p>
          <div className="space-y-1">
            {DEMO_LOCATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentOrigin(preset);
                  setShowLocationPicker(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  currentOrigin.label === preset.label
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{preset.label}</span>
                {currentOrigin.label === preset.label && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Campus Location Badge / Offline Status Notice at Bottom Left */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
        <div className="bg-white/95 border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 text-[11px] text-slate-700 pointer-events-auto">
          <span className={`w-2 h-2 rounded-full ${isGoogleMapsActive ? 'bg-emerald-600' : 'bg-blue-600'}`} />
          <span className="font-semibold text-slate-900">MVGR Campus</span>
          <span className="text-slate-400">• Vizianagaram</span>
          {hasAuthError && (
            <button 
              onClick={() => setShowApiKeyModal(true)}
              className="ml-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Offline Plan
            </button>
          )}
        </div>
      </div>

      {/* 3. MAP RENDERING VIEWPORT */}
      <div className="absolute inset-0 w-full h-full">
        {/* Loading status */}
        {loadingStatus === APILoadingStatus.LOADING && !hasAuthError && (
          <div className="absolute inset-0 z-20 bg-slate-100/90 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-7 h-7 rounded-full border-2 border-blue-900 border-t-transparent animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-800">Loading MVGR campus...</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Vizianagaram, Andhra Pradesh</p>
          </div>
        )}

        {/* If Google Maps is active and error-free, render Google Map */}
        {isGoogleMapsActive ? (
          <Map
            defaultCenter={MVGR_CAMPUS_CENTER}
            defaultZoom={MVGR_CAMPUS_COORDINATES.defaultZoom}
            mapTypeId={mapType}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            disableDefaultUI={true}
            zoomControl={true}
            gestureHandling="greedy"
          >
            <MapCameraController targetPlace={selectedPlace} />

            {/* Simulated "You are here" marker */}
            <AdvancedMarker
              position={{ lat: currentOrigin.lat, lng: currentOrigin.lng }}
              title={`Demo Location: ${currentOrigin.label}`}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 animate-ping absolute" />
                <div className="w-5 h-5 rounded-full bg-blue-800 border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </AdvancedMarker>

            {/* Campus Place Markers */}
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              
              const getPinColor = (cat: string) => {
                switch (cat) {
                  case 'Academic': return '#1e3a8a';
                  case 'Laboratory': return '#047857';
                  case 'Administration': return '#334155';
                  case 'Library': return '#b45309';
                  case 'Entrance': return '#7c2d12';
                  case 'Hostel': return '#3730a3';
                  case 'Sports': return '#15803d';
                  case 'Food': return '#c2410c';
                  case 'Medical': return '#b91c1c';
                  default: return '#0369a1';
                }
              };

              const pinBackground = getPinColor(place.category);

              return (
                <AdvancedMarker
                  key={place.id}
                  position={{ lat: place.latitude, lng: place.longitude }}
                  onClick={() => handleSelectPlace(place)}
                  title={place.name}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <Pin
                      background={isSelected ? '#0f172a' : pinBackground}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.2 : 0.9}
                    />
                    <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold shadow-xs border whitespace-nowrap transition-transform ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 scale-105' 
                        : 'bg-white/95 text-slate-800 border-slate-200'
                    }`}>
                      {place.name.length > 20 ? place.name.slice(0, 18) + '…' : place.name}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        ) : (
          /* Seamless verified campus plan fallback */
          <VectorMapFallback
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            userCoords={currentOrigin}
          />
        )}
      </div>

      {/* 4. SELECTED LOCATION BOTTOM SHEET */}
      <MapBottomSheet
        place={selectedPlace}
        onClose={() => {
          setSelectedPlace(null);
          if (onClearInitialPlace) onClearInitialPlace();
        }}
        onNavigate={(place) => setActiveNavigationDestination(place)}
        onOpenDetails={(place) => setDetailedPlace(place)}
        userCoords={currentOrigin}
        walkingDistanceMeters={selectedPlaceDistance}
        walkingTimeMinutes={selectedPlaceWalkingMinutes}
      />

      {/* 5. LOCATION DETAILS MODAL */}
      {detailedPlace && (
        <PlaceDetailsModal
          place={detailedPlace}
          onClose={() => setDetailedPlace(null)}
          onNavigate={(place) => {
            setDetailedPlace(null);
            setActiveNavigationDestination(place);
          }}
          walkingDistanceMeters={selectedPlaceDistance}
          walkingTimeMinutes={selectedPlaceWalkingMinutes}
        />
      )}

      {/* 6. WALKING NAVIGATION PREVIEW & EXTERNAL GOOGLE MAPS HANDOFF */}
      {activeNavigationDestination && (
        <NavigationRouteView
          destination={activeNavigationDestination}
          originName={currentOrigin.label}
          distanceMeters={selectedPlaceDistance || 150}
          walkingMinutes={selectedPlaceWalkingMinutes || 2}
          onBack={() => setActiveNavigationDestination(null)}
        />
      )}

      {/* 7. API KEY ASSISTANCE & ACTIVATION GUIDANCE MODAL */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Google Maps API Status</span>
              </div>
              <button onClick={() => setShowApiKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
              <p className="font-semibold">Notice: ApiNotActivatedMapError</p>
              <p className="text-[11px] leading-relaxed">
                The current API key has not enabled the <strong>Maps JavaScript API</strong> in Google Cloud Console. The interactive MVGR Verified Campus Plan is functioning in offline mode.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Use an alternative Google Maps Key (Optional):
              </label>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveCustomKey}
                className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors"
              >
                Apply & Reload
              </button>
              <button
                onClick={() => {
                  window.__googleMapsAuthError = false;
                  setHasAuthError(false);
                  setShowApiKeyModal(false);
                }}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
