import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Building, 
  Layers, 
  Clock, 
  ExternalLink, 
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';
import { CampusPlace } from '../../data/campusPlaces';

interface MapBottomSheetProps {
  place: CampusPlace | null;
  onClose: () => void;
  onNavigate: (place: CampusPlace) => void;
  onOpenDetails: (place: CampusPlace) => void;
  userCoords: { lat: number; lng: number } | null;
  walkingDistanceMeters: number | null;
  walkingTimeMinutes: number | null;
}

export const MapBottomSheet: React.FC<MapBottomSheetProps> = ({
  place,
  onClose,
  onNavigate,
  onOpenDetails,
  walkingDistanceMeters,
  walkingTimeMinutes,
}) => {
  if (!place) return null;

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-xl rounded-t-xl max-h-[80vh] overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Top Handle */}
      <div className="pt-2 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
        <div className="w-8 h-1 bg-slate-300 rounded-full" />
      </div>

      <div className="px-5 pb-5 pt-1">
        {/* Representative Campus Photograph if available */}
        {place.imageSrc && (
          <div className="mb-3 relative h-28 w-full rounded-lg overflow-hidden border border-slate-200">
            <img
              src={place.imageSrc}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-[11px] font-medium flex items-center justify-between">
              <span className="font-semibold drop-shadow-xs">Official MVGR Facility</span>
              <span className="text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-200">Verified</span>
            </div>
          </div>
        )}

        {/* Header with Title and Category */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {place.category}
              </span>
              {place.verified && (
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {place.name}
            </h3>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close location card"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Building & Floor Information */}
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {place.building && (
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{place.building}</span>
            </div>
          )}
          {place.floor && (
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{place.floor}</span>
            </div>
          )}
          {place.room && (
            <div className="flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-blue-900 font-semibold">{place.room}</span>
            </div>
          )}
        </div>

        {/* Distance & Walking Time */}
        {walkingDistanceMeters !== null && walkingTimeMinutes !== null && (
          <div className="mt-3 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-900 shrink-0" />
              <span>Distance: <strong className="text-slate-900 font-semibold font-mono">{walkingDistanceMeters > 1000 ? `${(walkingDistanceMeters / 1000).toFixed(1)} km` : `${walkingDistanceMeters} m`}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Est. walk: <strong className="text-slate-900 font-semibold font-mono">{walkingTimeMinutes} min</strong></span>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
          {place.description}
        </p>

        {/* Fresher / Student Guidance Tip */}
        {place.landmarkTip && (
          <div className="mt-2.5 p-2 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-950">
            <span className="font-semibold text-blue-900">Campus Tip: </span>
            <span>{place.landmarkTip}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onNavigate(place)}
            className="flex-1 py-2.5 px-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>NAVIGATE</span>
          </button>

          <button
            onClick={() => onOpenDetails(place)}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>VIEW DETAILS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
