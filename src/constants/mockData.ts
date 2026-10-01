import { Room, UserSession, Booking } from '../types';

export const INITIAL_USER: UserSession = {
  id: 'usr_2026_01',
  name: 'Alex Nguyen',
  email: 'alex.nguyen@campus.edu',
  studentId: 'STU-88294',
  department: 'Computer Science & Engineering',
  role: 'Undergraduate',
  weeklyHoursQuota: 12,
  weeklyHoursUsed: 4,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  notificationsEnabled: true,
};

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Turing Silent Pod A',
    building: 'Science Hub',
    floor: 'Floor 1, East Wing',
    capacity: 1,
    noiseLevel: 'Silent',
    amenities: ['Soundproof', 'Power Outlets', 'Ergonomic Chairs'],
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 38,
    description: 'A compact, sound-isolated individual pod designed for high-focus coding sessions and online exams.',
  },
  {
    id: 'room-2',
    name: 'Alpha Collaborative Hub',
    building: 'Main Library',
    floor: 'Floor 2, Central',
    capacity: 6,
    noiseLevel: 'Collaborative',
    amenities: ['Whiteboard', 'TV / Monitor', 'Power Outlets', 'Ergonomic Chairs'],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 52,
    description: 'Spacious collaborative room equipped with a 65" 4K display and floor-to-ceiling magnetic whiteboard.',
  },
  {
    id: 'room-3',
    name: 'Ada Lovelace Group Lab',
    building: 'Innovation Lab',
    floor: 'Floor 3, Tech Hub',
    capacity: 8,
    noiseLevel: 'Collaborative',
    amenities: ['Projector', 'Whiteboard', 'Video Conf', 'Power Outlets'],
    imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 45,
    description: 'Ideal for group capstone projects, pitch presentations, and hybrid team video conferences.',
  },
  {
    id: 'room-4',
    name: 'Newton Deep Focus Pod',
    building: 'Main Library',
    floor: 'Floor 3, Silent Zone',
    capacity: 2,
    noiseLevel: 'Silent',
    amenities: ['Soundproof', 'Standing Desk', 'Power Outlets'],
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 29,
    description: 'Dual-desk quiet station with motorized standing desks, daylight lamps, and acoustic foam walls.',
  },
  {
    id: 'room-5',
    name: 'Quantum Creative Suite',
    building: 'Engineering Wing',
    floor: 'Floor 4, North',
    capacity: 4,
    noiseLevel: 'Moderate',
    amenities: ['TV / Monitor', 'Whiteboard', 'Ergonomic Chairs'],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 31,
    description: 'A cozy 4-person breakout space with direct HDMI connection and dry-erase walls.',
  },
  {
    id: 'room-6',
    name: 'Archimedes Think Tank',
    building: 'Graduate Centre',
    floor: 'Floor 5, Penthouse',
    capacity: 10,
    noiseLevel: 'Collaborative',
    amenities: ['Projector', 'Whiteboard', 'Video Conf', 'Power Outlets', 'Ergonomic Chairs'],
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 64,
    description: 'Premium conference-style study suite featuring state-of-the-art acoustics and campus skyline view.',
  },
];

// Helper to get formatted date string for today and tomorrow
export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-mock-1',
    roomId: 'room-2',
    roomName: 'Alpha Collaborative Hub',
    building: 'Main Library',
    floor: 'Floor 2, Central',
    roomImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    userId: 'usr_other_99',
    userName: 'David Miller',
    date: getTodayString(),
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Senior Project Sprint',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-mock-2',
    roomId: 'room-1',
    roomName: 'Turing Silent Pod A',
    building: 'Science Hub',
    floor: 'Floor 1, East Wing',
    roomImage: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80',
    userId: 'usr_2026_01', // Booked by Alex Nguyen (logged-in user)
    userName: 'Alex Nguyen',
    date: getTodayString(),
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Algorithmic Complexity Prep',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];
