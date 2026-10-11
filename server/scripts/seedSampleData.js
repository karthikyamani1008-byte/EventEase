require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Event = require('../src/models/Event');
const Booking = require('../src/models/Booking');

const sampleEventsList = [
  {
    title: 'NextGen AI & Cloud Summit 2026',
    description: 'Join industry pioneers and student innovators exploring generative AI architectures, distributed cloud deployments, and hands-on LLM agent engineering. Features keynote speeches, live demos, and a networking lunch.',
    category: 'technology',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-11-15T09:30:00.000Z'),
    endDateTime: new Date('2026-11-15T17:00:00.000Z'),
    venue: 'Kavuri Grand Auditorium, Main Block',
    location: 'Campus Centre, Hall A',
    price: 0,
    isFree: true,
    capacity: 250,
    availableSeats: 48,
    registrationDeadline: new Date('2026-11-12T23:59:59.000Z'),
    status: 'approved',
    rules: [
      'Carry valid college student identification badge.',
      'Laptops required for afternoon hands-on breakout rooms.',
      'Certificates will only be awarded for full-day attendance.',
    ],
    eligibility: 'Open to all undergraduate and postgraduate engineering students.',
  },
  {
    title: 'HackCampus: 36-Hour National Hackathon',
    description: 'The annual flagship hackathon bringing together over 400 developers, designers, and problem solvers to build groundbreaking solutions in Healthcare, FinTech, and Green Tech. Cash prizes worth $10,000.',
    category: 'hackathons',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-11-20T18:00:00.000Z'),
    endDateTime: new Date('2026-11-22T08:00:00.000Z'),
    venue: 'Innovation & Incubation Hub, 3rd Floor',
    location: 'North Campus Hub',
    price: 25,
    isFree: false,
    capacity: 100,
    availableSeats: 12,
    registrationDeadline: new Date('2026-11-17T18:00:00.000Z'),
    status: 'approved',
    rules: [
      'Teams of 2 to 4 members are required.',
      'All code must be written during the hackathon hours.',
      'Pre-existing design components and boilerplate are permitted.',
    ],
    eligibility: 'Enrolled college students from any registered university.',
  },
  {
    title: 'Full-Stack React & Node.js Masterclass',
    description: 'An intensive weekend workshop walking through modern React 19 server components, high-performance Node APIs, state management, and real-time WebSockets with production deployment on Render.',
    category: 'workshops',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-11-28T10:00:00.000Z'),
    endDateTime: new Date('2026-11-28T16:00:00.000Z'),
    venue: 'Turing Computer Lab 4',
    location: 'Science Complex, Lab 4',
    price: 15,
    isFree: false,
    capacity: 60,
    availableSeats: 5,
    registrationDeadline: new Date('2026-11-26T23:59:59.000Z'),
    status: 'approved',
    rules: [
      'Prior basic knowledge of JavaScript and HTML is recommended.',
      'Node.js v20+ and VS Code must be pre-installed on personal laptops.',
    ],
    eligibility: 'Open to all years and disciplines.',
  },
  {
    title: 'Aura 2026: Annual Inter-College Cultural Fest',
    description: 'Three days of vibrant music, street theater, choreography battles, art installations, and culinary stalls. Featuring guest celebrity artists and inter-collegiate band performances.',
    category: 'cultural',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-12-05T16:00:00.000Z'),
    endDateTime: new Date('2026-12-07T22:00:00.000Z'),
    venue: 'Open Air Amphitheatre',
    location: 'Central Lawn & Stage',
    price: 0,
    isFree: true,
    capacity: 1200,
    availableSeats: 340,
    registrationDeadline: new Date('2026-12-04T12:00:00.000Z'),
    status: 'approved',
    rules: [
      'Free general pass requires valid student ticket confirmation QR.',
      'Outside food and glassware not permitted in the amphitheatre.',
      'Gates close strictly at 7:30 PM each evening.',
    ],
    eligibility: 'College students and verified alumni.',
  },
  {
    title: 'Robotics & Embedded Systems Bootcamp',
    description: 'Learn Arduino, ESP32 microcontrollers, sensor integration, and motor kinematics. Build your own autonomous line-following bot during the interactive lab sessions.',
    category: 'technology',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-12-10T09:00:00.000Z'),
    endDateTime: new Date('2026-12-11T16:30:00.000Z'),
    venue: 'Mechatronics Workshop Bay 2',
    location: 'Engineering Workshop Block',
    price: 20,
    isFree: false,
    capacity: 45,
    availableSeats: 18,
    registrationDeadline: new Date('2026-12-08T18:00:00.000Z'),
    status: 'approved',
    rules: [
      'Hardware toolkits will be provided at the lab on returnable basis.',
      'Safety goggles must be worn during mechanical assembly.',
    ],
    eligibility: 'All undergraduate students.',
  },
  {
    title: 'Inter-Collegiate Futsal Championship',
    description: '5-a-side indoor football tournament featuring 32 campus teams competing for the annual trophy and individual MVP awards. Fast-paced, high-intensity matches under floodlights.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    startDateTime: new Date('2026-12-14T15:00:00.000Z'),
    endDateTime: new Date('2026-12-16T21:00:00.000Z'),
    venue: 'Indoor Sports Complex Arena',
    location: 'South Campus Athletics',
    price: 0,
    isFree: true,
    capacity: 300,
    availableSeats: 0,
    registrationDeadline: new Date('2026-12-12T23:59:59.000Z'),
    status: 'approved',
    rules: [
      'Teams must consist of 5 playing members and up to 3 substitutes.',
      'Standard FIFA futsal footwear strictly required.',
    ],
    eligibility: 'Registered college teams with athletic clearance.',
  }
];

const seedSampleData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventease';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for Sample Data Seeding...');

    // 1. Clear existing events and bookings
    await Booking.deleteMany({});
    await Event.deleteMany({});

    // 2. Ensure an Organizer user exists
    let organizer = await User.findOne({ role: 'organizer' });
    if (!organizer) {
      const passwordHash = await User.hashPassword('OrganizerPass123!');
      organizer = await User.create({
        name: 'Google Developer Student Club',
        email: 'gdsc.lead@campus.edu',
        passwordHash,
        role: 'organizer',
        department: 'School of Computer Science',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      });
      console.log(`[Seed] Created Organizer User: ${organizer.email}`);
    }

    // 3. Ensure a Student user exists
    let student = await User.findOne({ role: 'student' });
    if (!student) {
      const passwordHash = await User.hashPassword('StudentPass123!');
      student = await User.create({
        name: 'Alex Johnson',
        email: 'alex.johnson@campus.edu',
        passwordHash,
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'CS-2023-049',
        status: 'active',
      });
      console.log(`[Seed] Created Student User: ${student.email}`);
    }

    // 4. Insert events linked to the organizer
    const eventsToInsert = sampleEventsList.map((e) => ({
      ...e,
      organizer: organizer._id,
    }));

    const insertedEvents = await Event.insertMany(eventsToInsert);
    console.log(`[Seed SUCCESS] Inserted ${insertedEvents.length} events into database.`);

    // 5. Create a sample confirmed booking for the student
    const sampleBooking = await Booking.create({
      student: student._id,
      event: insertedEvents[0]._id,
      bookingReference: 'EVT-782194',
      status: 'confirmed',
      bookedAt: new Date(),
    });
    console.log(`[Seed SUCCESS] Created sample booking #${sampleBooking.bookingReference} for ${student.name}`);

    await mongoose.disconnect();
    console.log('[Seed] Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed FAILED]:', error);
    process.exit(1);
  }
};

seedSampleData();
