import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { CampusPlace, CAMPUS_PLACES, CAMPUS_BOUNDS } from '../../data/campusPlaces';

interface VectorMapFallbackProps {
  places: CampusPlace[];
  selectedPlace: CampusPlace | null;
  onSelectPlace: (place: CampusPlace) => void;
  userCoords: { lat: number; lng: number };
}

export const VectorMapFallback: React.FC<VectorMapFallbackProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userCoords,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Convert lat/lng to local SVG canvas coordinates (400x500 viewport)
  const mapWidth = 500;
  const mapHeight = 600;

  const latToY = (lat: number) => {
    const latSpan = CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south;
    return ((CAMPUS_BOUNDS.north - lat) / latSpan) * (mapHeight - 80) + 40;
  };

  const lngToX = (lng: number) => {
    const lngSpan = CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west;
    return ((lng - CAMPUS_BOUNDS.west) / lngSpan) * (mapWidth - 80) + 40;
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full bg-[#f4f6f8] overflow-hidden select-none">
      {/* Fallback Notice Banner */}
      <div className="absolute top-2 left-3 right-3 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-semibold text-slate-900">MVGR Campus Plan</span>
          <span className="text-slate-400 hidden sm:inline">• 43-Acre Autonomous Campus</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">18.0601° N, 83.4055° E</span>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-1.5 bg-white border border-slate-200 shadow-md rounded-lg p-1">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.2))}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.8))}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={resetView}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
          title="Reset View"
          aria-label="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas Map */}
      <svg 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <defs>
          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width={mapWidth} height={mapHeight} fill="url(#campusGrid)" />

        {/* Campus Boundary Perimeter */}
        <path
          d="M 60 80 L 440 60 L 460 520 L 70 540 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />

        {/* Campus Internal Pathways / Walking Avenues */}
        {/* Main Central Avenue from Main Gate */}
        <line x1={lngToX(83.40395)} y1={latToY(18.06165)} x2={lngToX(83.40515)} y2={latToY(18.06068)} stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
        <line x1={lngToX(83.40395)} y1={latToY(18.06165)} x2={lngToX(83.40515)} y2={latToY(18.06068)} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

        {/* Admin to Library and Academic Crossroad */}
        <line x1={lngToX(83.40515)} y1={latToY(18.06068)} x2={lngToX(83.40582)} y2={latToY(18.06012)} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <line x1={lngToX(83.40515)} y1={latToY(18.06068)} x2={lngToX(83.40625)} y2={latToY(18.06095)} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <line x1={lngToX(83.40582)} y1={latToY(18.06012)} x2={lngToX(83.40612)} y2={latToY(18.05965)} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <line x1={lngToX(83.40515)} y1={latToY(18.06068)} x2={lngToX(83.40465)} y2={latToY(18.06042)} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <line x1={lngToX(83.40465)} y1={latToY(18.06042)} x2={lngToX(83.40445)} y2={latToY(18.05975)} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <line x1={lngToX(83.40445)} y1={latToY(18.05975)} x2={lngToX(83.40522)} y2={latToY(18.05885)} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        
        {/* Sports Ground Area */}
        <ellipse cx={lngToX(83.40695)} cy={latToY(18.06175)} rx="45" ry="32" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" />
        <text x={lngToX(83.40695)} y={latToY(18.06175)} fontSize="9" fill="#047857" fontWeight="bold" textAnchor="middle">Cricket Oval</text>

        {/* Central Garden Lawn */}
        <circle cx={lngToX(83.4054)} cy={latToY(18.0604)} r="26" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x={lngToX(83.4054)} y={latToY(18.0604)} fontSize="8" fill="#15803d" fontWeight="600" textAnchor="middle">Central Lawn</text>

        {/* User Current Location Indicator */}
        <g>
          <circle cx={lngToX(userCoords.lng)} cy={latToY(userCoords.lat)} r="12" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
          <circle cx={lngToX(userCoords.lng)} cy={latToY(userCoords.lat)} r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Campus Place Markers */}
        {places.map((place) => {
          const x = lngToX(place.longitude);
          const y = latToY(place.latitude);
          const isSelected = selectedPlace?.id === place.id;

          const getCategoryFill = (cat: string) => {
            switch(cat) {
              case 'Academic': return '#1d4ed8'; // Blue
              case 'Laboratory': return '#059669'; // Emerald
              case 'Administration': return '#334155'; // Slate
              case 'Library': return '#d97706'; // Amber
              case 'Entrance': return '#7c2d12'; // Rust
              case 'Medical': return '#b91c1c'; // Red
              case 'Food': return '#ea580c'; // Orange
              case 'Sports': return '#16a34a'; // Green
              case 'Hostel': return '#4f46e5'; // Indigo
              default: return '#0284c7';
            }
          };

          const fill = getCategoryFill(place.category);

          return (
            <g 
              key={place.id} 
              className="cursor-pointer group"
              onClick={() => onSelectPlace(place)}
            >
              {isSelected && (
                <circle cx={x} cy={y} r="18" fill={fill} fillOpacity="0.25" stroke={fill} strokeWidth="1.5" />
              )}
              
              {/* Marker Pin */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 10 : 8}
                fill={isSelected ? fill : '#ffffff'}
                stroke={fill}
                strokeWidth={isSelected ? 3 : 2.5}
                className="transition-all duration-150 drop-shadow-xs group-hover:r-9"
              />

              {/* Inner dot */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 3.5 : 3}
                fill={isSelected ? '#ffffff' : fill}
              />

              {/* Label */}
              <g transform={`translate(${x}, ${y + (isSelected ? 16 : 14)})`}>
                <rect
                  x="-45"
                  y="-1"
                  width="90"
                  height="14"
                  rx="3"
                  fill="#ffffff"
                  fillOpacity="0.95"
                  stroke={isSelected ? fill : '#e2e8f0'}
                  strokeWidth={isSelected ? 1.2 : 0.8}
                />
                <text
                  x="0"
                  y="9"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight={isSelected ? 'bold' : '600'}
                  fill={isSelected ? '#0f172a' : '#475569'}
                  fontFamily="sans-serif"
                >
                  {place.name.length > 17 ? place.name.slice(0, 16) + '…' : place.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
