import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { COLORS, SHADOWS } from '../../constants/theme';
import { INITIAL_USER } from '../../constants/mockData';

export default function ProfileScreen() {
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  const toggleNotifications = useStore((state) => state.toggleNotifications);
  const bookings = useStore((state) => state.bookings);

  const totalBookingsCount = bookings.filter((b) => b.userId === user.id).length;
  const activeBookingsCount = bookings.filter(
    (b) => b.userId === user.id && b.status === 'confirmed'
  ).length;

  const handleSwitchUser = () => {
    if (user.id === 'usr_2026_01') {
      updateUser({
        id: 'usr_2026_02',
        name: 'Maya Patel',
        email: 'maya.patel@campus.edu',
        studentId: 'STU-99412',
        department: 'Biomedical Informatics',
        role: 'Postgraduate',
        weeklyHoursQuota: 16,
        weeklyHoursUsed: 2,
        avatarUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      });
      Alert.alert('Session Switched', 'Logged in as Maya Patel (Postgraduate)');
    } else {
      updateUser(INITIAL_USER);
      Alert.alert('Session Switched', 'Logged in as Alex Nguyen (Undergraduate)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Student Profile</Text>
          <Text style={styles.subtitle}>Campus session & reservation credentials</Text>
        </View>

        {/* Digital Campus Card */}
        <View style={styles.campusCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.universityBadge}>
              <Ionicons name="school" size={16} color="#FFFFFF" />
              <Text style={styles.universityName}>CAMPUS STUDY PASS</Text>
            </View>
            <View style={styles.chipGraphic}>
              <Ionicons name="hardware-chip-outline" size={24} color="#FDE047" />
            </View>
          </View>

          <View style={styles.cardMain}>
            <Image source={{ uri: user.avatarUrl }} style={styles.cardAvatar} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{user.name}</Text>
              <Text style={styles.cardId}>{user.studentId}</Text>
              <Text style={styles.cardDept}>{user.department}</Text>
              <View style={styles.rolePill}>
                <Text style={styles.rolePillText}>{user.role}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>VALID: 2026 ACADEMIC YEAR</Text>
            <View style={styles.nfcRow}>
              <Ionicons name="wifi" size={16} color="#FFFFFF" />
              <Text style={styles.nfcText}>NFC Enabled</Text>
            </View>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeBookingsCount}</Text>
            <Text style={styles.statLabel}>Active Slots</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalBookingsCount}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {user.weeklyHoursQuota - user.weeklyHoursUsed}h
            </Text>
            <Text style={styles.statLabel}>Quota Left</Text>
          </View>
        </View>

        {/* Settings & Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences & Reminders</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconBg,
                  { backgroundColor: COLORS.primaryLight },
                ]}
              >
                <Ionicons name="notifications" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Local Reminders</Text>
                <Text style={styles.settingDesc}>
                  Alert 15 mins before booked time
                </Text>
              </View>
            </View>
            <Switch
              value={user.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Multi-User Session Switcher */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Multi-User Testing</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleSwitchUser}
            activeOpacity={0.8}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconBg,
                  { backgroundColor: COLORS.successLight },
                ]}
              >
                <Ionicons name="swap-horizontal" size={18} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Switch Student Session</Text>
                <Text style={styles.settingDesc}>
                  Toggle between Alex (Undergrad) & Maya (Postgrad)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
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
  campusCard: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: COLORS.primaryDark,
    padding: 20,
    ...SHADOWS.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  universityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  universityName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chipGraphic: {
    opacity: 0.85,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C7D2FE',
    marginBottom: 2,
  },
  cardDept: {
    fontSize: 12,
    color: '#E0E7FF',
    marginBottom: 6,
  },
  rolePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardFooterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C7D2FE',
    letterSpacing: 0.5,
  },
  nfcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nfcText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
