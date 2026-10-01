import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Room } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';
import { Badge } from './Badge';

interface RoomCardProps {
  room: Room;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({ room }) => {
  const handlePress = () => {
    router.push({
      pathname: '/room/[id]',
      params: { id: room.id },
    });
  };

  const getNoiseVariant = () => {
    switch (room.noiseLevel) {
      case 'Silent':
        return 'success';
      case 'Moderate':
        return 'warning';
      case 'Collaborative':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({room.reviewCount})</Text>
        </View>

        <View style={styles.noiseBadgeContainer}>
          <Badge
            label={room.noiseLevel}
            variant={getNoiseVariant()}
            icon={
              <Ionicons
                name={
                  room.noiseLevel === 'Silent'
                    ? 'volume-mute'
                    : room.noiseLevel === 'Moderate'
                    ? 'volume-medium'
                    : 'people'
                }
                size={12}
                color={
                  room.noiseLevel === 'Silent'
                    ? COLORS.success
                    : room.noiseLevel === 'Moderate'
                    ? COLORS.warning
                    : COLORS.primary
                }
              />
            }
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.titleArea}>
            <Text style={styles.roomName} numberOfLines={1}>
              {room.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {room.building} • {room.floor}
              </Text>
            </View>
          </View>
          <Badge
            label={`${room.capacity} ${room.capacity === 1 ? 'person' : 'seats'}`}
            variant="subtle"
            icon={<Ionicons name="person-outline" size={12} color={COLORS.textSecondary} />}
          />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        <View style={styles.amenitiesRow}>
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityChip}>
              <Ionicons name="checkmark-circle-outline" size={12} color={COLORS.primary} />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <Text style={styles.moreAmenitiesText}>
              +{room.amenities.length - 3} more
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.availableText}>Available Today</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Slots</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Optimized with React.memo to prevent unnecessary re-renders in FlatList
export const RoomCard = React.memo(RoomCardComponent, (prev, next) => {
  return prev.room.id === next.room.id && prev.room.rating === next.room.rating;
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...SHADOWS.sm,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  noiseBadgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 14,
    gap: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  amenityText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.primaryDark,
  },
  moreAmenitiesText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
