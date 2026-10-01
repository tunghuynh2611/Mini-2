import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Amenity } from '../types';
import { COLORS } from '../constants/theme';
import { useStore } from '../store/useStore';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const ALL_AMENITIES: Amenity[] = [
  'Whiteboard',
  'TV / Monitor',
  'Projector',
  'Soundproof',
  'Standing Desk',
  'Power Outlets',
  'Video Conf',
  'Ergonomic Chairs',
];

const CAPACITY_OPTIONS = [
  { label: 'Any Size', value: null },
  { label: '1+ Person', value: 1 },
  { label: '2+ People', value: 2 },
  { label: '4+ People', value: 4 },
  { label: '6+ People', value: 6 },
  { label: '8+ People', value: 8 },
];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const filters = useStore((state) => state.filters);
  const setMinCapacity = useStore((state) => state.setMinCapacity);
  const toggleAmenity = useStore((state) => state.toggleAmenity);
  const resetFilters = useStore((state) => state.resetFilters);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Study Rooms</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Minimum Capacity Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Capacity</Text>
              <View style={styles.optionsWrap}>
                {CAPACITY_OPTIONS.map((opt) => {
                  const isSelected = filters.minCapacity === opt.value;
                  return (
                    <TouchableOpacity
                      key={String(opt.value)}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => setMinCapacity(opt.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Required Amenities Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Amenities</Text>
              <View style={styles.optionsWrap}>
                {ALL_AMENITIES.map((amenity) => {
                  const isSelected = filters.amenities.includes(amenity);
                  return (
                    <TouchableOpacity
                      key={amenity}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => toggleAmenity(amenity)}
                    >
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color="#FFFFFF"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
