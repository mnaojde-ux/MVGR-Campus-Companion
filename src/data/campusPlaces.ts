import { mvgrAssets } from '../assets/mvgrAssets';

export type CampusCategory = 
  | 'All'
  | 'Academic'
  | 'Laboratory'
  | 'Administration'
  | 'Library'
  | 'Entrance'
  | 'Hostel'
  | 'Food'
  | 'Medical'
  | 'Sports'
  | 'Facilities'
  | 'Other';

export interface CampusPlace {
  id: string;
  name: string;
  category: CampusCategory;
  description: string;
  latitude: number;
  longitude: number;
  building?: string;
  floor?: string;
  room?: string;
  type: 'building' | 'facility' | 'entrance' | 'service' | 'sports';
  verified: boolean;
  navigationEnabled: boolean;
  landmarkTip?: string; // High-value tip for new students like Arjun
  keywords?: string[];
  imageSrc?: string;
}

export const MVGR_CAMPUS_CENTER = {
  lat: 18.060178,
  lng: 83.405580,
  zoom: 17,
};

export const CAMPUS_BOUNDS = {
  north: 18.0645,
  south: 18.0560,
  east: 83.4100,
  west: 83.4010,
};

export const CAMPUS_PLACES: CampusPlace[] = [
  {
    id: 'main-gate',
    name: 'MVGR Main Gate & Security',
    category: 'Entrance',
    description: 'The primary grand arched entrance of MVGR Autonomous College, security checkpoint, and campus visitor desk.',
    latitude: 18.061650,
    longitude: 83.403950,
    building: 'Main Entrance Arch',
    floor: 'Ground Level',
    type: 'entrance',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'All city buses and campus autos drop here. Security personnel can direct visitors and freshers.',
    keywords: ['entrance', 'gate', 'security', 'arch', 'auto stand', 'bus stop'],
    imageSrc: mvgrAssets.mainGate,
  },
  {
    id: 'admin-block',
    name: 'Administrative Block & Exam Cell',
    category: 'Administration',
    description: 'Houses the Principal’s Office, Dean Academics, Autonomous Examination Cell, Student Accounts, and Central Verification.',
    latitude: 18.060680,
    longitude: 83.405150,
    building: 'Administrative Block',
    floor: 'Ground & 1st Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Located straight ahead through the main avenue garden. Examination Cell is on the ground floor right wing.',
    keywords: ['admin', 'principal', 'exam cell', 'fees', 'scholarship', 'autonomous', 'hall ticket'],
    imageSrc: mvgrAssets.adminBlock,
  },
  {
    id: 'central-library',
    name: 'Dr. P.V.G. Raju Central Library',
    category: 'Library',
    description: 'Three-story central library with over 60,000 volumes, IEEE digital access center, quiet reading halls, and reference section.',
    latitude: 18.060120,
    longitude: 83.405820,
    building: 'Central Library Building',
    floor: 'Ground, 1st & 2nd Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Recognizable by its circular portico. Digital Library & E-Journals section is on the 1st floor.',
    keywords: ['library', 'books', 'reading room', 'ieee', 'digital library', 'journals', 'study hall']
  },
  {
    id: 'cse-block',
    name: 'CSE Department Block',
    category: 'Academic',
    description: 'Computer Science and Engineering department with smart classrooms, faculty cabins, department library, and server rooms.',
    latitude: 18.060950,
    longitude: 83.406250,
    building: 'Department of CSE',
    floor: 'Ground, 1st, 2nd & 3rd Floor',
    room: 'Classrooms 101-410',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'East quadrangle behind the Admin lawn. Main lecture halls 201-205 are on the 1st floor.',
    keywords: ['cse', 'computer science', 'b.tech cse', 'coding', 'machine learning class', 'hod cse']
  },
  {
    id: 'it-block',
    name: 'Information Technology (IT) Block',
    category: 'Academic',
    description: 'Department of Information Technology, software engineering labs, and project demonstration rooms.',
    latitude: 18.061220,
    longitude: 83.406450,
    building: 'IT Department Wing',
    floor: '1st & 2nd Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Directly adjoining the CSE east corridor via the covered skywalk.',
    keywords: ['it', 'information technology', 'software', 'cloud computing']
  },
  {
    id: 'del-lab',
    name: 'Digital Engineering Lab & Computing Centre',
    category: 'Laboratory',
    description: 'High-performance computing laboratory, AI/ML research facilities, cloud infrastructure lab, and hackathon workspace.',
    latitude: 18.061150,
    longitude: 83.405720,
    building: 'Central Computing Complex',
    floor: 'Ground & 1st Floor',
    room: 'Labs 1 to 6',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Air-conditioned computing block with biometric entry. Lab 3 is on the upper level.',
    keywords: ['lab', 'digital engineering', 'computer lab', 'del', 'ai lab', 'practical', 'programming']
  },
  {
    id: 'bsh-block',
    name: 'Basic Sciences & Humanities (1st Year Block)',
    category: 'Academic',
    description: 'Primary academic home for all first-year B.Tech students (Arjun’s block). Physics, Chemistry, Mathematics, and English departments.',
    latitude: 18.060420,
    longitude: 83.404650,
    building: 'BS&H Block',
    floor: 'Ground, 1st & 2nd Floor',
    room: 'Rooms BSH-01 to BSH-24',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Closest academic building to the main entrance. Freshers orientation desk is in the central foyer.',
    keywords: ['1st year', 'freshers', 'arjun', 'physics', 'chemistry', 'maths', 'english', 'bsh', 'orientation']
  },
  {
    id: 'ece-block',
    name: 'ECE Department Block',
    category: 'Academic',
    description: 'Electronics & Communication Engineering department, VLSI design labs, Embedded Systems studio, and DSP workstations.',
    latitude: 18.059650,
    longitude: 83.406120,
    building: 'ECE Block',
    floor: 'Ground, 1st & 2nd Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'South-east academic quadrangle with antenna dish masts on the terrace.',
    keywords: ['ece', 'electronics', 'circuits', 'vlsi', 'embedded', 'signals']
  },
  {
    id: 'eee-block',
    name: 'EEE Department Block',
    category: 'Academic',
    description: 'Electrical & Electronics Engineering block, power systems lab, electrical machines lab, and renewable energy simulation bay.',
    latitude: 18.059420,
    longitude: 83.405780,
    building: 'EEE Block',
    floor: 'Ground & 1st Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Heavy machinery lab is on the ground floor with reinforced flooring.',
    keywords: ['eee', 'electrical', 'machines lab', 'power systems', 'circuits']
  },
  {
    id: 'mech-block',
    name: 'Mechanical Engineering Complex',
    category: 'Academic',
    description: 'Mechanical Engineering department, central workshops, foundry, thermal engineering lab, and CAD/CAM center.',
    latitude: 18.058850,
    longitude: 83.405220,
    building: 'Mechanical & Workshop Block',
    floor: 'Ground & 1st Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'South zone. Central workshop sheds are adjacent to the main building.',
    keywords: ['mech', 'mechanical', 'workshop', 'lathe', 'cad cam', 'thermal']
  },
  {
    id: 'civil-chem-block',
    name: 'Civil & Chemical Engineering Block',
    category: 'Academic',
    description: 'Civil Engineering and Chemical Engineering departments, environmental testing lab, strength of materials lab.',
    latitude: 18.058600,
    longitude: 83.404550,
    building: 'Civil & Chem Block',
    floor: 'Ground & 1st Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Concrete testing equipment and environmental monitoring station outside the entrance.',
    keywords: ['civil', 'chemical', 'structural', 'surveying', 'environmental']
  },
  {
    id: 'auditorium',
    name: 'Central Auditorium & Open Air Theatre',
    category: 'Facilities',
    description: 'Air-conditioned 1,200-seat auditorium for college fests, international conferences, induction programs, and convocation.',
    latitude: 18.060980,
    longitude: 83.404980,
    building: 'MVGR Central Auditorium',
    floor: 'Ground & Balcony',
    type: 'facility',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Next to the central lawn. Freshers induction programs are conducted here.',
    keywords: ['auditorium', 'oat', 'stage', 'fest', 'induction', 'seminar', 'cultural']
  },
  {
    id: 'canteen',
    name: 'Student Canteen & Food Court',
    category: 'Food',
    description: 'Spacious student cafeteria serving South Indian tiffins, vegetarian meals, fresh juice counter, and snack bakery.',
    latitude: 18.059750,
    longitude: 83.404450,
    building: 'Campus Food Court',
    floor: 'Ground Floor & Outdoor Canopy',
    type: 'facility',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Located amidst shaded neem trees between BS&H and Civil blocks. Open 7:30 AM to 6:30 PM.',
    keywords: ['canteen', 'food', 'lunch', 'breakfast', 'coffee', 'snacks', 'juice', 'tea']
  },
  {
    id: 'tap-cell',
    name: 'Training and Placement Cell (TAP)',
    category: 'Administration',
    description: 'Corporate interview rooms, group discussion auditoriums, coding evaluation suites, and training directorate.',
    latitude: 18.060480,
    longitude: 83.405420,
    building: 'Administrative Annex',
    floor: '1st Floor',
    type: 'service',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Entrance is via the eastern staircase of the Admin Block.',
    keywords: ['placement', 'tap cell', 'jobs', 'interviews', 'campus recruit', 'training']
  },
  {
    id: 'sports-complex',
    name: 'Sports Complex & Cricket Ground',
    category: 'Sports',
    description: 'Full-sized standard cricket oval, athletic track, basketball court, badminton hall, and gymnasium.',
    latitude: 18.061750,
    longitude: 83.406950,
    building: 'Physical Education Complex',
    floor: 'Ground Level & Indoor Pavilion',
    type: 'sports',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'North-east sector of the campus with open green fields and floodlit courts.',
    keywords: ['sports', 'ground', 'cricket', 'basketball', 'gym', 'badminton', 'athletics']
  },
  {
    id: 'boys-hostel',
    name: 'Boys Hostels & Dining Hall',
    category: 'Hostel',
    description: 'On-campus residential blocks for male students with high-speed Wi-Fi, recreation rooms, and hygienic mess.',
    latitude: 18.057950,
    longitude: 83.406250,
    building: 'Sardar Patel Hostel Blocks',
    floor: 'Ground to 3rd Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Quiet southern boundary of the campus, accessible via the south ring path.',
    keywords: ['hostel', 'boys hostel', 'mess', 'rooms', 'residential']
  },
  {
    id: 'girls-hostel',
    name: 'Girls Hostels & Resident Warden Office',
    category: 'Hostel',
    description: 'Gated residential block for female students with 24/7 security, resident medical warden, study halls, and dining mess.',
    latitude: 18.058350,
    longitude: 83.403850,
    building: 'Kasturba Hostel Complex',
    floor: 'Ground to 3rd Floor',
    type: 'building',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Secure south-west enclave with dedicated security desk and visitor lounge.',
    keywords: ['hostel', 'girls hostel', 'residential', 'warden', 'women']
  },
  {
    id: 'health-center',
    name: 'Campus Health Centre & Dispensary',
    category: 'Medical',
    description: 'First-aid center staffed with medical officer, emergency observation beds, basic pharmacy, and 24-hour campus ambulance station.',
    latitude: 18.060850,
    longitude: 83.404220,
    building: 'Dispensary Annex',
    floor: 'Ground Floor',
    type: 'service',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Next to the campus postal kiosk, 150m inwards from the Main Gate.',
    keywords: ['doctor', 'medical', 'hospital', 'health', 'first aid', 'ambulance', 'medicine']
  },
  {
    id: 'sbi-bank-atm',
    name: 'SBI Branch & 24/7 ATM',
    category: 'Facilities',
    description: 'State Bank of India MVGR on-campus branch, deposit counters, and two 24-hour multi-function ATMs.',
    latitude: 18.061450,
    longitude: 83.404120,
    building: 'Campus Commercial Wing',
    floor: 'Ground Floor',
    type: 'service',
    verified: true,
    navigationEnabled: true,
    landmarkTip: 'Right by the inside gate plaza next to the student stationery store.',
    keywords: ['atm', 'bank', 'sbi', 'cash', 'money', 'fee payment']
  }
];

export const CATEGORY_LIST: CampusCategory[] = [
  'All',
  'Academic',
  'Laboratory',
  'Administration',
  'Library',
  'Entrance',
  'Hostel',
  'Food',
  'Medical',
  'Sports'
];
