import { create } from 'zustand';
import { Room, Booking, UserSession, ActiveFilters, Building, Amenity } from '../types';
import { MOCK_ROOMS, INITIAL_USER, INITIAL_BOOKINGS, getTodayString } from '../constants/mockData';
import { isTimeOverlap, calculateDurationHours } from '../utils/timeUtils';
import { sendBookingConfirmationNotification, scheduleBookingReminder } from '../utils/notifications';

interface StoreState {
  // User Session
  user: UserSession;
  updateUser: (updates: Partial<UserSession>) => void;
  toggleNotifications: () => void;

  // Rooms
  rooms: Room[];

  // Bookings
  bookings: Booking[];
  isTimeSlotAvailable: (roomId: string, date: string, startTime: string, endTime: string) => boolean;
  createBooking: (params: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  cancelBooking: (bookingId: string) => void;

  // Filters
  filters: ActiveFilters;
  setSearchQuery: (query: string) => void;
  setBuilding: (building: Building) => void;
  setMinCapacity: (capacity: number | null) => void;
  toggleAmenity: (amenity: Amenity) => void;
  setDate: (date: string) => void;
  resetFilters: () => void;
}

const initialFilters: ActiveFilters = {
  searchQuery: '',
  building: 'All',
  minCapacity: null,
  amenities: [],
  date: getTodayString(),
};

export const useStore = create<StoreState>((set, get) => ({
  user: INITIAL_USER,
  rooms: MOCK_ROOMS,
  bookings: INITIAL_BOOKINGS,
  filters: initialFilters,

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },

  toggleNotifications: () => {
    set((state) => ({
      user: {
        ...state.user,
        notificationsEnabled: !state.user.notificationsEnabled,
      },
    }));
  },

  isTimeSlotAvailable: (roomId, date, startTime, endTime) => {
    const { bookings } = get();
    // Find all confirmed reservations for this room and date
    const conflictingBooking = bookings.find((b) => {
      if (b.roomId !== roomId) return false;
      if (b.date !== date) return false;
      if (b.status === 'cancelled') return false;

      return isTimeOverlap(startTime, endTime, b.startTime, b.endTime);
    });

    return !conflictingBooking;
  },

  createBooking: async ({ roomId, date, startTime, endTime, purpose }) => {
    const { rooms, bookings, user, isTimeSlotAvailable } = get();
    const room = rooms.find((r) => r.id === roomId);

    if (!room) {
      return { success: false, error: 'Room does not exist.' };
    }

    const duration = calculateDurationHours(startTime, endTime);

    // Quota check
    if (user.weeklyHoursUsed + duration > user.weeklyHoursQuota) {
      return {
        success: false,
        error: `Booking exceeds weekly allowance (${user.weeklyHoursUsed}/${user.weeklyHoursQuota} hours used).`,
      };
    }

    // Time-slot conflict check
    if (!isTimeSlotAvailable(roomId, date, startTime, endTime)) {
      return {
        success: false,
        error: `Conflict detected! This room is already reserved for the selected time slot (${startTime} - ${endTime}).`,
      };
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      roomImage: room.imageUrl,
      userId: user.id,
      userName: user.name,
      date,
      startTime,
      endTime,
      purpose: purpose || 'Academic Study',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Update store state
    set((state) => ({
      bookings: [newBooking, ...state.bookings],
      user: {
        ...state.user,
        weeklyHoursUsed: state.user.weeklyHoursUsed + duration,
      },
    }));

    // Trigger local notifications
    if (user.notificationsEnabled) {
      await sendBookingConfirmationNotification(room.name, date, startTime, endTime);
      await scheduleBookingReminder(newBooking.id, room.name, date, startTime);
    }

    return { success: true, booking: newBooking };
  },

  cancelBooking: (bookingId) => {
    const { bookings, user } = get();
    const target = bookings.find((b) => b.id === bookingId);
    if (!target || target.status === 'cancelled') return;

    const duration = calculateDurationHours(target.startTime, target.endTime);

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ),
      user: {
        ...state.user,
        weeklyHoursUsed: Math.max(0, user.weeklyHoursUsed - duration),
      },
    }));
  },

  setSearchQuery: (searchQuery) => {
    set((state) => ({ filters: { ...state.filters, searchQuery } }));
  },

  setBuilding: (building) => {
    set((state) => ({ filters: { ...state.filters, building } }));
  },

  setMinCapacity: (minCapacity) => {
    set((state) => ({ filters: { ...state.filters, minCapacity } }));
  },

  toggleAmenity: (amenity) => {
    set((state) => {
      const exists = state.filters.amenities.includes(amenity);
      const updated = exists
        ? state.filters.amenities.filter((a) => a !== amenity)
        : [...state.filters.amenities, amenity];
      return { filters: { ...state.filters, amenities: updated } };
    });
  },

  setDate: (date) => {
    set((state) => ({ filters: { ...state.filters, date } }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
