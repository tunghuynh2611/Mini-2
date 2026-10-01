import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const user = useStore((state) => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileSection}
          activeOpacity={0.8}
          onPress={() => router.push('/profile')}
        >
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Hi, {user.name.split(' ')[0]}</Text>
              <Text style={styles.handWave}>👋</Text>
            </View>
            <Text style={styles.subtext}>
              {user.studentId} • {user.department.split('&')[0].trim()}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/bookings')}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons
              name={user.notificationsEnabled ? 'notifications-outline' : 'notifications-off-outline'}
              size={20}
              color={user.notificationsEnabled ? COLORS.primary : COLORS.textMuted}
            />
            {user.notificationsEnabled && <View style={styles.badgeDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quota bar */}
      <View style={styles.quotaBar}>
        <View style={styles.quotaInfo}>
          <View style={styles.quotaLabelGroup}>
            <Ionicons name="time-outline" size={14} color={COLORS.primary} />
            <Text style={styles.quotaLabel}>Weekly Study Quota</Text>
          </View>
          <Text style={styles.quotaValue}>
            {user.weeklyHoursUsed} / {user.weeklyHoursQuota} hrs used
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(
                  100,
                  (user.weeklyHoursUsed / user.weeklyHoursQuota) * 100
                )}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  handWave: {
    fontSize: 16,
    marginLeft: 4,
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  quotaBar: {
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 12,
  },
  quotaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quotaLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quotaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  quotaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#C7D2FE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});
