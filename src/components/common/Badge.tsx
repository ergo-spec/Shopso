import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'accent' | 'default';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  const theme = colors.light;

  let bg = theme.primaryLight;
  let text = '#ffffff';

  if (variant === 'success') {
    bg = theme.successLight;
    text = theme.success;
  } else if (variant === 'warning') {
    bg = theme.warningLight;
    text = theme.warning;
  } else if (variant === 'danger') {
    bg = theme.dangerLight;
    text = theme.danger;
  } else if (variant === 'accent') {
    bg = theme.accentLight;
    text = theme.accent;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
