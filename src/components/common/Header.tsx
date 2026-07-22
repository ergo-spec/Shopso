import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightElement,
}) => {
  const theme = colors.light;

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    backgroundColor: colors.light.card,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
