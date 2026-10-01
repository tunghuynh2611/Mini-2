import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStore } from '../../store/useStore';
import { Booking } from '../../types';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/Badge';

export default function BookingsScreen() {
  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const user = useStore((state) => state.user);

  const [filterType, setFilterType] = useState<'active' | 'all'>('active');

  const displayedBookings = bookings.filter((b) => {
    if (filterType === 'active') {
      return b.status === 'confirmed';
    }
    return true;
  });

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Reservation?',
      `Are you sure you want to cancel your booking for ${booking.roomName} on ${booking.date} (${booking.startTime} - ${booking.endTime})?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelBooking(booking.id),
        },
      ]
    );
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const isCancelled = item.status === 'cancelled';
    const isMine = item.userId === user.id;

    return (
      <View style={[styles.card, isCancelled && styles.cardCancelled]}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.roomImage }} style={styles.roomThumb} />
          <View style={styles.roomHeaderInfo}>
            <Text style={styles.roomName}>{item.roomName}</Text>
            <Text style={styles.buildingText}>
              {item.building} • {item.floor}
            </Text>
            <View style={styles.statusRow}>
              <Badge
                label={isCancelled ? 'Cancelled' : 'Confirmed'}
                variant={isCancelled ? 'danger' : 'success'}
                icon={
                  <Ionicons
                    name={isCancelled ? 'close-circle' : 'checkmark-circle'}
                    size={12}
                    color={isCancelled ? COLORS.danger : COLORS.success}
                  />
                }
              />
              {!isMine && (
                <Badge
                  label={`By ${item.userName}`}
                  variant="subtle"
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={15} color={COLORS.primary} />
            <Text style={styles.detailText}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="bookmark-outline" size={15} color={COLORS.accent} />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.purpose}
            </Text>
          </View>
        </View>

        {!isCancelled && isMine && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item)}
            >
              <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
              <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewRoomButton}
              onPress={() =>
                router.push({
                  pathname: '/room/[id]',
                  params: { id: item.roomId },
                })
              }
            >
              <Text style={styles.viewRoomText}>Room Info</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Screen Title */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>
            Manage and view your study reservations
          </Text>
        </View>
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            filterType === 'active' && styles.segmentButtonActive,
          ]}
          onPress={() => setFilterType('active')}
        >
          <Text
            style={[
              styles.segmentText,
              filterType === 'active' && styles.segmentTextActive,
            ]}
          >
            Active Reservations (
            {bookings.filter((b) => b.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            filterType === 'all' && styles.segmentButtonActive,
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text
            style={[
              styles.segmentText,
              filterType === 'all' && styles.segmentTextActive,
            ]}
          >
            History & Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Active Reservations</Text>
            <Text style={styles.emptySubtitle}>
              You have no active study room reservations booked right now.
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <Ionicons name="search" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.browseButtonText}>Find Available Rooms</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardCancelled: {
    opacity: 0.65,
    backgroundColor: '#FAFAFA',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  roomThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  roomHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  buildingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsSection: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger,
  },
  viewRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewRoomText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
