export const sampleCategories = [
  { id: 'all', label: 'All Events', count: 12 },
  { id: 'technology', label: 'Technology', count: 4, icon: 'Cpu', color: 'from-blue-500/10 to-indigo-500/10' },
  { id: 'workshops', label: 'Workshops', count: 3, icon: 'Lightbulb', color: 'from-amber-500/10 to-orange-500/10' },
  { id: 'hackathons', label: 'Hackathons', count: 2, icon: 'Code', color: 'from-purple-500/10 to-pink-500/10' },
  { id: 'cultural', label: 'Cultural', count: 2, icon: 'Music', color: 'from-rose-500/10 to-red-500/10' },
  { id: 'sports', label: 'Sports', count: 1, icon: 'Trophy', color: 'from-emerald-500/10 to-teal-500/10' },
];

export const sampleEvents = [
  {
    id: 'evt-101',
    title: 'NextGen AI & Cloud Summit 2026',
    description: 'Join industry pioneers and student innovators exploring generative AI architectures, distributed cloud deployments, and hands-on LLM agent engineering. Features keynote speeches, live demos, and a networking lunch.',
    category: 'technology',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-11-15T09:30:00.000Z',
    endDateTime: '2026-11-15T17:00:00.000Z',
    venue: 'Kavuri Grand Auditorium, Main Block',
    location: 'Campus Centre, Hall A',
    price: 0,
    isFree: true,
    capacity: 250,
    availableSeats: 48,
    registrationDeadline: '2026-11-12T23:59:59.000Z',
    status: 'approved',
    organizer: {
      name: 'Google Developer Student Club (GDSC)',
      email: 'gdsc.lead@campus.edu',
      department: 'School of Computer Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Carry valid college student identification badge.',
      'Laptops required for afternoon hands-on breakout rooms.',
      'Certificates will only be awarded for full-day attendance.'
    ],
    eligibility: 'Open to all undergraduate and postgraduate engineering students.'
  },
  {
    id: 'evt-102',
    title: 'HackCampus: 36-Hour National Hackathon',
    description: 'The annual flagship hackathon bringing together over 400 developers, designers, and problem solvers to build groundbreaking solutions in Healthcare, FinTech, and Green Tech. Cash prizes worth $10,000.',
    category: 'hackathons',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-11-20T18:00:00.000Z',
    endDateTime: '2026-11-22T08:00:00.000Z',
    venue: 'Innovation & Incubation Hub, 3rd Floor',
    location: 'North Campus Hub',
    price: 25,
    isFree: false,
    capacity: 100,
    availableSeats: 12,
    registrationDeadline: '2026-11-17T18:00:00.000Z',
    status: 'approved',
    organizer: {
      name: 'ACM Student Chapter',
      email: 'acm.chair@campus.edu',
      department: 'Department of IT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Teams of 2 to 4 members are required.',
      'All code must be written during the hackathon hours.',
      'Pre-existing design components and boilerplate are permitted.'
    ],
    eligibility: 'Enrolled college students from any registered university.'
  },
  {
    id: 'evt-103',
    title: 'Full-Stack React & Node.js Masterclass',
    description: 'An intensive weekend workshop walking through modern React 19 server components, high-performance Node APIs, state management, and real-time WebSockets with production deployment on Render.',
    category: 'workshops',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-11-28T10:00:00.000Z',
    endDateTime: '2026-11-28T16:00:00.000Z',
    venue: 'Turing Computer Lab 4',
    location: 'Science Complex, Lab 4',
    price: 15,
    isFree: false,
    capacity: 60,
    availableSeats: 5,
    registrationDeadline: '2026-11-26T23:59:59.000Z',
    status: 'approved',
    organizer: {
      name: 'Web Innovation Society',
      email: 'web.society@campus.edu',
      department: 'Software Engineering',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Prior basic knowledge of JavaScript and HTML is recommended.',
      'Node.js v20+ and VS Code must be pre-installed on personal laptops.'
    ],
    eligibility: 'Open to all years and disciplines.'
  },
  {
    id: 'evt-104',
    title: 'Aura 2026: Annual Inter-College Cultural Fest',
    description: 'Three days of vibrant music, street theater, choreography battles, art installations, and culinary stalls. Featuring guest celebrity artists and inter-collegiate band performances.',
    category: 'cultural',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-12-05T16:00:00.000Z',
    endDateTime: '2026-12-07T22:00:00.000Z',
    venue: 'Open Air Amphitheatre',
    location: 'Central Lawn & Stage',
    price: 0,
    isFree: true,
    capacity: 1200,
    availableSeats: 340,
    registrationDeadline: '2026-12-04T12:00:00.000Z',
    status: 'approved',
    organizer: {
      name: 'Student Cultural Affairs Board',
      email: 'cultural.board@campus.edu',
      department: 'Dean of Student Welfare',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Free general pass requires valid student ticket confirmation QR.',
      'Outside food and glassware not permitted in the amphitheatre.',
      'Gates close strictly at 7:30 PM each evening.'
    ],
    eligibility: 'College students and verified alumni.'
  },
  {
    id: 'evt-105',
    title: 'Robotics & Embedded Systems Bootcamp',
    description: 'Learn Arduino, ESP32 microcontrollers, sensor integration, and motor kinematics. Build your own autonomous line-following bot during the interactive lab sessions.',
    category: 'technology',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-12-10T09:00:00.000Z',
    endDateTime: '2026-12-11T16:30:00.000Z',
    venue: 'Mechatronics Workshop Bay 2',
    location: 'Engineering Workshop Block',
    price: 20,
    isFree: false,
    capacity: 45,
    availableSeats: 18,
    registrationDeadline: '2026-12-08T18:00:00.000Z',
    status: 'approved',
    organizer: {
      name: 'Robotics Club',
      email: 'robotics@campus.edu',
      department: 'Mechanical & Electronics Dept',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Hardware toolkits will be provided at the lab on returnable basis.',
      'Safety goggles must be worn during mechanical assembly.'
    ],
    eligibility: 'All undergraduate students.'
  },
  {
    id: 'evt-106',
    title: 'Inter-Collegiate Futsal Championship',
    description: '5-a-side indoor football tournament featuring 32 campus teams competing for the annual trophy and individual MVP awards. Fast-paced, high-intensity matches under floodlights.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-12-14T15:00:00.000Z',
    endDateTime: '2026-12-16T21:00:00.000Z',
    venue: 'Indoor Sports Complex Arena',
    location: 'South Campus Athletics',
    price: 0,
    isFree: true,
    capacity: 300,
    availableSeats: 0, // Fully booked demonstration
    registrationDeadline: '2026-12-12T23:59:59.000Z',
    status: 'approved',
    organizer: {
      name: 'Department of Physical Education',
      email: 'sports@campus.edu',
      department: 'Campus Athletics Board',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Teams must consist of 5 playing members and up to 3 substitutes.',
      'Standard FIFA futsal footwear (non-marking soles) strictly required.'
    ],
    eligibility: 'Registered college teams with athletic clearance.'
  },
  {
    id: 'evt-107',
    title: 'UI/UX Design Thinking & Figma Workshop',
    description: 'Learn wireframing, high-fidelity responsive component libraries, accessible color theory, micro-interactions, and design systems from senior product designers.',
    category: 'workshops',
    bannerImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-12-18T11:00:00.000Z',
    endDateTime: '2026-12-18T16:00:00.000Z',
    venue: 'Design Studio Lab 1',
    location: 'Visual Arts Block',
    price: 10,
    isFree: false,
    capacity: 50,
    availableSeats: 22,
    registrationDeadline: '2026-12-16T18:00:00.000Z',
    status: 'approved',
    organizer: {
      name: 'Creative Media Guild',
      email: 'design@campus.edu',
      department: 'School of Design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Figma free account setup required before attending.',
      'Participants will complete and present a live case study redesign.'
    ],
    eligibility: 'Anyone enthusiastic about digital product design.'
  },
  {
    id: 'evt-108',
    title: 'CyberSecurity & Ethical Hacking Seminar',
    description: 'Explore live penetration testing techniques, web vulnerability analysis (OWASP Top 10), cryptographic protocols, and defensive security strategies presented by certified ethical hackers.',
    category: 'technology',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    startDateTime: '2026-12-22T14:00:00.000Z',
    endDateTime: '2026-12-22T18:00:00.000Z',
    venue: 'Seminar Hall 3',
    location: 'CS Block, 2nd Floor',
    price: 0,
    isFree: true,
    capacity: 150,
    availableSeats: 64,
    registrationDeadline: '2026-12-20T23:59:59.000Z',
    status: 'approved',
    organizer: {
      name: 'CyberDefense Student Circle',
      email: 'cybersec@campus.edu',
      department: 'Information Security Division',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    },
    rules: [
      'Strict adherence to institutional IT ethics code of conduct.',
      'Network testing permitted only within the sandbox lab environment.'
    ],
    eligibility: 'Open to all students with basic networking familiarity.'
  }
];
