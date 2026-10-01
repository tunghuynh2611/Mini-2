import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/Badge';
import {
  STANDARD_TIME_SLOTS,
  getNextDays,
  isTimeOverlap,
} from '../../utils/timeUtils';

const PURPOSES = [
  'Deep Focus Study',
  'Group Project Sprint',
  'Exam Preparation',
  'Video Conference / Interview',
];

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rooms = useStore((state) => state.rooms);
  const bookings = useStore((state) => state.bookings);
  const user = useStore((state) => state.user);
  const createBooking = useStore((state) => state.createBooking);

  const room = rooms.find((r) => r.id === id);

  const days = useMemo(() => getNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState<string>(days[0].dateStr);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>(PURPOSES[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!room) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.notFoundTitle}>Study Room Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Return to Rooms</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Evaluate conflict status for each time slot on the selected date
  const slotAvailability = useMemo(() => {
    return STANDARD_TIME_SLOTS.map((slot) => {
      // Find conflicting booking on this date & room
      const conflict = bookings.find((b) => {
        if (b.roomId !== room.id) return false;
        if (b.date !== selectedDate) return false;
        if (b.status === 'cancelled') return false;

        return isTimeOverlap(slot.start, slot.end, b.startTime, b.endTime);
      });

      if (!conflict) {
        return { ...slot, status: 'available', booking: null };
      }

      if (conflict.userId === user.id) {
        return { ...slot, status: 'mine', booking: conflict };
      }

      return { ...slot, status: 'occupied', booking: conflict };
    });
  }, [bookings, room.id, selectedDate, user.id]);

  const selectedSlot =
    selectedSlotIndex !== null ? STANDARD_TIME_SLOTS[selectedSlotIndex] : null;

  const handleBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Select a Slot', 'Please select an available time slot first.');
      return;
    }

    setIsSubmitting(true);
    const result = await createBooking({
      roomId: room.id,
      date: selectedDate,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      purpose: selectedPurpose,
    });
    setIsSubmitting(false);

    if (result.success) {
      Alert.alert(
        '🎉 Reservation Confirmed!',
        `You have successfully booked ${room.name} for ${selectedDate} (${selectedSlot.label}). A local reminder has been scheduled!`,
        [
          {
            text: 'View My Bookings',
            onPress: () => router.push('/bookings'),
          },
          {
            text: 'Done',
            style: 'cancel',
          },
        ]
      );
      setSelectedSlotIndex(null);
    } else {
      Alert.alert('Booking Failed', result.error || 'Could not complete reservation.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: room.name,
          headerBackTitle: 'Rooms',
        }}
      />

      <View style={styles.screenWrapper}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: room.imageUrl }} style={styles.heroImage} />
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingPillText}>{room.rating.toFixed(1)}</Text>
              <Text style={styles.reviewPillText}>({room.reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Room Details Header */}
          <View style={styles.contentSection}>
            <View style={styles.badgeRow}>
              <Badge
                label={`${room.capacity} ${room.capacity === 1 ? 'Person' : 'Seats'}`}
                variant="primary"
                icon={<Ionicons name="people" size={13} color={COLORS.primary} />}
              />
              <Badge
                label={`${room.noiseLevel} Zone`}
                variant={room.noiseLevel === 'Silent' ? 'success' : 'warning'}
                icon={<Ionicons name="volume-mute" size={13} color={COLORS.success} />}
              />
              <Badge
                label={room.building}
                variant="subtle"
                icon={<Ionicons name="business" size={13} color={COLORS.textSecondary} />}
              />
            </View>

            <Text style={styles.roomTitle}>{room.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.locationText}>
                {room.building}, {room.floor}
              </Text>
            </View>

            <Text style={styles.descriptionText}>{room.description}</Text>

            {/* Amenities Section */}
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionHeading}>Included Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {room.amenities.map((amenity, idx) => (
                  <View key={idx} style={styles.amenityCard}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                    <Text style={styles.amenityCardText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Date Selection */}
            <View style={styles.bookingStep}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Select Date</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysScroll}
              >
                {days.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <TouchableOpacity
                      key={d.dateStr}
                      style={[
                        styles.dayCard,
                        isSelected && styles.dayCardSelected,
                      ]}
                      onPress={() => {
                        setSelectedDate(d.dateStr);
                        setSelectedSlotIndex(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.dayName,
                          isSelected && styles.dayNameSelected,
                        ]}
                      >
                        {d.dayName}
                      </Text>
                      <Text
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberSelected,
                        ]}
                      >
                        {d.dayNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Time Slot Conflict Prevention Grid */}
            <View style={styles.bookingStep}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Choose Time Slot</Text>
              </View>

              {/* Slot Legend */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: COLORS.surfaceSubtle }]} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: COLORS.dangerLight }]} />
                  <Text style={styles.legendText}>Occupied</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: COLORS.primaryLight }]} />
                  <Text style={styles.legendText}>Your Booking</Text>
                </View>
              </View>

              <View style={styles.slotGrid}>
                {slotAvailability.map((slot, index) => {
                  const isSelected = selectedSlotIndex === index;
                  const isOccupied = slot.status === 'occupied';
                  const isMine = slot.status === 'mine';

                  return (
                    <TouchableOpacity
                      key={slot.start}
                      disabled={isOccupied || isMine}
                      style={[
                        styles.slotCard,
                        isSelected && styles.slotCardSelected,
                        isOccupied && styles.slotCardOccupied,
                        isMine && styles.slotCardMine,
                      ]}
                      onPress={() => setSelectedSlotIndex(index)}
                    >
                      <View style={styles.slotTimeRow}>
                        <Ionicons
                          name={
                            isOccupied
                              ? 'close-circle'
                              : isMine
                              ? 'checkmark-circle'
                              : isSelected
                              ? 'radio-button-on'
                              : 'time-outline'
                          }
                          size={14}
                          color={
                            isSelected
                              ? '#FFFFFF'
                              : isOccupied
                              ? COLORS.danger
                              : isMine
                              ? COLORS.primary
                              : COLORS.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.slotTimeText,
                            isSelected && styles.slotTextSelected,
                            isOccupied && styles.slotTextOccupied,
                            isMine && styles.slotTextMine,
                          ]}
                        >
                          {slot.start} - {slot.end}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.slotStatusLabel,
                          isSelected && styles.slotTextSelected,
                          isOccupied && styles.slotStatusOccupied,
                          isMine && styles.slotStatusMine,
                        ]}
                      >
                        {isOccupied
                          ? 'Occupied'
                          : isMine
                          ? 'Booked by you'
                          : isSelected
                          ? 'Selected'
                          : 'Available'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Purpose Selection */}
            <View style={styles.bookingStep}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Session Purpose</Text>
              </View>
              <View style={styles.purposeWrap}>
                {PURPOSES.map((purpose) => {
                  const isSelected = selectedPurpose === purpose;
                  return (
                    <TouchableOpacity
                      key={purpose}
                      style={[
                        styles.purposeChip,
                        isSelected && styles.purposeChipSelected,
                      ]}
                      onPress={() => setSelectedPurpose(purpose)}
                    >
                      <Text
                        style={[
                          styles.purposeChipText,
                          isSelected && styles.purposeChipTextSelected,
                        ]}
                      >
                        {purpose}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Bottom Booking Sticky Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>
              {selectedSlot ? `${selectedDate} • ${selectedSlot.label}` : 'Choose a time slot'}
            </Text>
            <Text style={styles.quotaNotice}>
              Quota impact: 1 hour (Remaining: {user.weeklyHoursQuota - user.weeklyHoursUsed}h)
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedSlot || isSubmitting) && styles.confirmButtonDisabled,
            ]}
            disabled={!selectedSlot || isSubmitting}
            onPress={handleBooking}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Reserve Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 12,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroImageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  ratingPill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    ...SHADOWS.md,
  },
  ratingPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviewPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  contentSection: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  roomTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  amenityCardText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  bookingStep: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  daysScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  dayCard: {
    width: 64,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  dayCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  slotCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotCardOccupied: {
    backgroundColor: COLORS.dangerLight,
    borderColor: '#FECACA',
    opacity: 0.65,
  },
  slotCardMine: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#C7D2FE',
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  slotStatusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  slotTextSelected: {
    color: '#FFFFFF',
  },
  slotTextOccupied: {
    color: COLORS.danger,
  },
  slotStatusOccupied: {
    color: COLORS.danger,
  },
  slotTextMine: {
    color: COLORS.primaryDark,
  },
  slotStatusMine: {
    color: COLORS.primaryDark,
  },
  purposeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  purposeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  purposeChipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  purposeChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  purposeChipTextSelected: {
    color: COLORS.primaryDark,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.lg,
  },
  summaryInfo: {
    flex: 1,
    marginRight: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  quotaNotice: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
