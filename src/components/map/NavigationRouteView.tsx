import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowLeft, 
  Clock, 
  Compass, 
  ExternalLink, 
  CheckCircle2,
  Footprints,
  CornerDownRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { CampusPlace } from '../../data/campusPlaces';

interface NavigationRouteViewProps {
  destination: CampusPlace;
  originName: string;
  distanceMeters: number;
  walkingMinutes: number;
  onBack: () => void;
}

export const NavigationRouteView: React.FC<NavigationRouteViewProps> = ({
  destination,
  originName,
  distanceMeters,
  walkingMinutes,
  onBack,
}) => {
  const [navigatingState, setNavigatingState] = useState<'preview' | 'active'>('preview');
  const [activeStep, setActiveStep] = useState(0);

  // Realistic walking steps through MVGR campus tailored to the destination
  const getRouteSteps = () => {
    return [
      {
        instruction: `Start at ${originName}. Walk along the paved central pedestrian pathway.`,
        distance: `${Math.round(distanceMeters * 0.3)} m`,
        icon: Footprints,
      },
      {
        instruction: `Pass the central quadrangle garden towards ${destination.building || 'the main zone'}.`,
        distance: `${Math.round(distanceMeters * 0.4)} m`,
        icon: CornerDownRight,
      },
      {
        instruction: destination.landmarkTip 
          ? `Campus landmark guidance: ${destination.landmarkTip}`
          : `Reach the entrance of ${destination.name}.`,
        distance: `${Math.round(distanceMeters * 0.3)} m`,
        icon: MapPin,
      },
      {
        instruction: destination.floor 
          ? `Proceed to ${destination.floor}${destination.room ? ` (${destination.room})` : ''}.`
          : `Arrived at ${destination.name}.`,
        distance: 'Destination',
        icon: CheckCircle2,
      },
    ];
  };

  const steps = getRouteSteps();

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=walking`;

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 z-40 bg-white/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </button>

        <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Campus Walking Route
        </span>
      </div>

      <div className="p-4 flex-1">
        {/* Origin to Destination Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-sm" />
              <div className="w-0.5 h-8 bg-slate-300 my-0.5" />
              <div className="w-3.5 h-3.5 rounded-full bg-blue-700 border-2 border-white shadow-sm flex items-center justify-center">
                <MapPin className="w-2 h-2 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Starting From</p>
                <p className="text-sm font-semibold text-slate-800">{originName}</p>
              </div>
              <div className="pt-1">
                <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wider">Destination</p>
                <p className="text-sm font-bold text-slate-900">{destination.name}</p>
                {destination.building && (
                  <p className="text-xs text-slate-600">{destination.building} {destination.floor ? `• ${destination.floor}` : ''}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-around text-center">
            <div>
              <p className="text-[11px] text-slate-500">Distance</p>
              <p className="text-sm font-bold text-slate-900 font-mono">
                {distanceMeters > 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}
              </p>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-[11px] text-slate-500">Est. Walk Time</p>
              <p className="text-sm font-bold text-slate-900 font-mono flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                {walkingMinutes} min
              </p>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-[11px] text-slate-500">Route Type</p>
              <p className="text-xs font-semibold text-emerald-700">Pedestrian / Walk</p>
            </div>
          </div>
        </div>

        {/* Turn-by-Turn Waypoints */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Walking Directions</span>
            <span className="text-[11px] font-normal text-slate-500">{steps.length} steps</span>
          </h4>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected 
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isSelected ? 'text-blue-950 font-semibold' : 'text-slate-800'}`}>
                      {step.instruction}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.distance}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note on indoor vs outdoor routing */}
        <div className="p-3 bg-slate-100/80 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            MVGR Campus Companion provides exterior pedestrian navigation between college blocks. For classroom locations, consult the verified floor & room tags provided.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 space-y-2.5">
        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>START WALKING NAVIGATION IN GOOGLE MAPS</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onBack}
          className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Close Navigation View
        </button>
      </div>
    </div>
  );
};
