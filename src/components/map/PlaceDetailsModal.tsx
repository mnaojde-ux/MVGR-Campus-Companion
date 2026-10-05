import React from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  Info, 
  X, 
  Share2,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { CampusPlace } from '../../data/campusPlaces';

interface PlaceDetailsModalProps {
  place: CampusPlace | null;
  onClose: () => void;
  onNavigate: (place: CampusPlace) => void;
  walkingDistanceMeters: number | null;
  walkingTimeMinutes: number | null;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  onClose,
  onNavigate,
  walkingDistanceMeters,
  walkingTimeMinutes,
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Campus Directory</span>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Representative Facility Photo */}
          {place.imageSrc && (
            <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200">
              <img
                src={place.imageSrc}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                  Official Campus Architecture
                </span>
                <span className="text-xs font-bold">{place.name}</span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {place.category}
              </span>
              {place.verified && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified MVGR Facility
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {place.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Coordinates: {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
            </p>
          </div>

          {/* Quick Metrics */}
          {walkingDistanceMeters !== null && walkingTimeMinutes !== null && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <div>
                <p className="text-[11px] text-slate-500">Walking Distance</p>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {walkingDistanceMeters > 1000 ? `${(walkingDistanceMeters/1000).toFixed(1)} km` : `${walkingDistanceMeters} m`}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Estimated Walking Time</p>
                <p className="text-sm font-bold text-slate-900 font-mono flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  {walkingTimeMinutes} min
                </p>
              </div>
            </div>
          )}

          {/* Facility Location Details */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Facility Architecture</h3>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              {place.building && (
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Designated Block:</span>
                  <span className="font-semibold text-slate-800">{place.building}</span>
                </div>
              )}
              {place.floor && (
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Levels / Floors:</span>
                  <span className="font-semibold text-slate-800">{place.floor}</span>
                </div>
              )}
              {place.room && (
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Classroom / Room No:</span>
                  <span className="font-mono font-bold text-blue-900">{place.room}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Autonomous Status:</span>
                <span className="font-medium text-emerald-700">Official Campus Facility</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Overview</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-white">
              {place.description}
            </p>
          </div>

          {/* First-Year Student Navigator Tips */}
          {place.landmarkTip && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                <Info className="w-4 h-4 text-amber-700" />
                <span>First-Year Student Navigation Guidance</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {place.landmarkTip}
              </p>
            </div>
          )}

          {/* Campus Map Accuracy & Verification Note */}
          <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span>MVGR Autonomous Campus Geographic Registry • Verified GPS Coordinates</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              onNavigate(place);
            }}
            className="flex-1 py-3 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>NAVIGATE TO LOCATION</span>
          </button>
          
          <button
            onClick={onClose}
            className="py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
