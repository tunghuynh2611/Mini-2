import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { RoomCard } from '../../components/RoomCard';
import { Header } from '../../components/Header';
import { FilterModal } from '../../components/FilterModal';
import { Building, Room } from '../../types';
import { COLORS, SHADOWS } from '../../constants/theme';

const BUILDINGS: Building[] = [
  'All',
  'Main Library',
  'Science Hub',
  'Engineering Wing',
  'Graduate Centre',
  'Innovation Lab',
];

export default function StudyRoomsScreen() {
  const rooms = useStore((state) => state.rooms);
  const filters = useStore((state) => state.filters);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setBuilding = useStore((state) => state.setBuilding);
  const resetFilters = useStore((state) => state.resetFilters);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filtered rooms calculation using useMemo for high-performance rendering
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search query check (name, building, amenities)
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesBuilding = room.building.toLowerCase().includes(query);
        const matchesAmenity = room.amenities.some((a) =>
          a.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBuilding && !matchesAmenity) return false;
      }

      // Building filter
      if (filters.building !== 'All' && room.building !== filters.building) {
        return false;
      }

      // Minimum capacity filter
      if (filters.minCapacity !== null && room.capacity < filters.minCapacity) {
        return false;
      }

      // Amenities filter (must contain ALL selected amenities)
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) =>
          room.amenities.includes(a)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [rooms, filters]);

  // Pull-to-refresh simulation
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  // Memoized renderItem to ensure 60fps scrolling
  const renderItem = useCallback(
    ({ item }: { item: Room }) => <RoomCard room={item} />,
    []
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const hasActiveFilters =
    filters.minCapacity !== null || filters.amenities.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header with user session & quota */}
      <Header />

      {/* Search Bar & Filter Button */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search study room, building, or gear..."
            placeholderTextColor={COLORS.textMuted}
            value={filters.searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterIconButton,
            hasActiveFilters && styles.filterIconButtonActive,
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : COLORS.text}
          />
          {hasActiveFilters && <View style={styles.activeFilterDot} />}
        </TouchableOpacity>
      </View>

      {/* Buildings Horizontal Category Chips */}
      <View style={styles.buildingsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buildingsScroll}
        >
          {BUILDINGS.map((b) => {
            const isSelected = filters.building === b;
            return (
              <TouchableOpacity
                key={b}
                style={[
                  styles.buildingChip,
                  isSelected && styles.buildingChipSelected,
                ]}
                onPress={() => setBuilding(b)}
              >
                <Text
                  style={[
                    styles.buildingChipText,
                    isSelected && styles.buildingChipTextSelected,
                  ]}
                >
                  {b}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Live Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLivePill}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusLiveText}>REAL-TIME</Text>
        </View>
        <Text style={styles.resultsCountText}>
          Showing {filteredRooms.length} of {rooms.length} campus rooms
        </Text>
      </View>

      {/* Optimized FlatList for 60fps scrolling */}
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search" size={32} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Study Rooms Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search criteria, building, or amenities filter.
            </Text>
            <TouchableOpacity
              style={styles.emptyResetButton}
              onPress={resetFilters}
            >
              <Text style={styles.emptyResetText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  filterIconButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeFilterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  buildingsContainer: {
    backgroundColor: COLORS.surface,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  buildingsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  buildingChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSubtle,
  },
  buildingChipSelected: {
    backgroundColor: COLORS.primaryDark,
  },
  buildingChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  buildingChipTextSelected: {
    color: '#FFFFFF',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyResetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyResetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
