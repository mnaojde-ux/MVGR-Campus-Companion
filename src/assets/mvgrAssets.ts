/**
 * MVGR Official Campus Visual Assets Configuration
 * Centralized mapping for all MVGR photographs.
 * 
 * To replace photographs with real college images, place files in:
 * /public/assets/mvgr/
 * 
 * - mvgr-main-gate.jpg (Main entrance archway, autonomous gate)
 * - mvgr-campus.jpg (Campus lawn, walkways, trees)
 * - mvgr-building.jpg (Department blocks, academic architecture)
 * - mvgr-aerial.jpg (Campus aerial perspective, 43 acres)
 */

export interface MVGRAssetsConfig {
  mainGate: string;
  adminBlock: string;
  adminStatue: string;
  campus: string;
  building: string;
  aerial: string;
  crestSvg: string;
}

export const mvgrAssets: MVGRAssetsConfig = {
  mainGate: '/assets/mvgr/mvgr-main-gate.jpg',
  adminBlock: '/assets/mvgr/mvgr-admin-block.jpg',
  adminStatue: '/assets/mvgr/mvgr-admin-statue.jpg',
  campus: '/assets/mvgr/mvgr-campus.jpg',
  building: '/assets/mvgr/mvgr-building.jpg',
  aerial: '/assets/mvgr/mvgr-aerial.jpg',
  crestSvg: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="46" fill="#0f2756" stroke="#c59b27" stroke-width="4"/>
  <circle cx="50" cy="50" r="40" fill="#ffffff" stroke="#c59b27" stroke-width="1.5"/>
  <path d="M50 18 L57 32 L74 32 L61 42 L66 58 L50 48 L34 58 L39 42 L26 32 L43 32 Z" fill="#991b1b" stroke="#0f2756" stroke-width="0.5"/>
  <text x="50" y="73" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f2756" text-anchor="middle">MVGR</text>
  <text x="50" y="83" font-family="Arial, sans-serif" font-size="6.5" font-weight="600" fill="#c59b27" text-anchor="middle">AUTONOMOUS</text>
</svg>
`),
};

/**
 * Safe image fallback helper for component image rendering
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) => {
  const target = e.currentTarget;
  target.onerror = null; // Prevent loop
  if (fallbackSrc) {
    target.src = fallbackSrc;
  } else {
    // Hide image and show neutral background container
    target.style.display = 'none';
  }
};
