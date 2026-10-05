// Campus visual assets
import mainGatePhoto from './images/mvgr_main_gate_1791207405173.jpg';
import academicBlockPhoto from './images/mvgr_academic_block_1791207419570.jpg';
import campusAerialPhoto from './images/mvgr_campus_aerial_1791207438381.jpg';

export const CAMPUS_IMAGES = {
  mainGate: mainGatePhoto,
  academicBlock: academicBlockPhoto,
  campusAerial: campusAerialPhoto,
};

export const MVGR_CREST_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="46" fill="#0f2756" stroke="#c59b27" stroke-width="4"/>
  <circle cx="50" cy="50" r="40" fill="#ffffff" stroke="#c59b27" stroke-width="1.5"/>
  <path d="M50 16 L58 32 L76 32 L62 43 L67 60 L50 49 L33 60 L38 43 L24 32 L42 32 Z" fill="#991b1b" stroke="#0f2756" stroke-width="0.5"/>
  <text x="50" y="74" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f2756" text-anchor="middle">MVGR</text>
  <text x="50" y="84" font-family="Arial, sans-serif" font-size="6.5" font-weight="600" fill="#c59b27" text-anchor="middle">AUTONOMOUS</text>
</svg>
`);
