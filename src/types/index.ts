export type Building = 
  | 'All'
  | 'Main Library'
  | 'Science Hub'
  | 'Engineering Wing'
  | 'Graduate Centre'
  | 'Innovation Lab';

export type Amenity = 
  | 'Whiteboard'
  | 'TV / Monitor'
  | 'Projector'
  | 'Soundproof'
  | 'Standing Desk'
  | 'Power Outlets'
  | 'Video Conf'
  | 'Ergonomic Chairs';

export type NoiseLevel = 'Silent' | 'Moderate' | 'Collaborative';

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: string;
  capacity: number;
  noiseLevel: NoiseLevel;
  amenities: Amenity[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: string;
  roomImage: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "09:00")
  endTime: string;   // HH:mm (e.g. "11:00")
  purpose: string;
  status: BookingStatus;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  role: 'Undergraduate' | 'Postgraduate' | 'Faculty Researcher';
  weeklyHoursQuota: number;
  weeklyHoursUsed: number;
  avatarUrl: string;
  notificationsEnabled: boolean;
}

export interface ActiveFilters {
  searchQuery: string;
  building: Building;
  minCapacity: number | null;
  amenities: Amenity[];
  date: string; // YYYY-MM-DD
}
