import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface BadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'subtle';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'neutral',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.primaryLight, text: COLORS.primary };
      case 'success':
        return { bg: COLORS.successLight, text: COLORS.success };
      case 'warning':
        return { bg: COLORS.warningLight, text: COLORS.warning };
      case 'danger':
        return { bg: COLORS.dangerLight, text: COLORS.danger };
      case 'subtle':
        return { bg: COLORS.surfaceSubtle, text: COLORS.textSecondary };
      default:
        return { bg: '#F1F5F9', text: COLORS.textSecondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
