import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const theme = colors.light;

  const isGradient = variant === 'primary' || variant === 'accent';

  let gradientColors: [string, string] = [theme.primary, theme.primaryDark];
  let textColor = '#ffffff';
  let borderWidth = 0;
  let borderColor = 'transparent';
  let backgroundColor = 'transparent';

  if (variant === 'accent') {
    gradientColors = ['#6366f1', '#4f46e5']; // Indigo gradient
  } else if (variant === 'secondary') {
    backgroundColor = theme.primaryLight;
    textColor = '#ffffff';
  } else if (variant === 'danger') {
    backgroundColor = theme.danger;
    textColor = '#ffffff';
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = theme.border;
    borderWidth = 1.5;
    textColor = theme.text;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = theme.textMuted;
  }

  // Size variations
  let height = 48;
  let fontSize = typography.sizes.md;
  let paddingHorizontal = spacing.lg;

  if (size === 'sm') {
    height = 38;
    fontSize = typography.sizes.sm;
    paddingHorizontal = spacing.md;
  } else if (size === 'lg') {
    height = 56;
    fontSize = typography.sizes.lg;
    paddingHorizontal = spacing.xl;
  }

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize,
                fontWeight: typography.weights.semibold,
                marginLeft: icon && iconPosition === 'left' ? spacing.sm : 0,
                marginRight: icon && iconPosition === 'right' ? spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  if (isGradient && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.touchable, fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.buttonBase,
            { height, paddingHorizontal, borderRadius: borderRadius.md },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        {
          height,
          paddingHorizontal,
          borderRadius: borderRadius.md,
          backgroundColor: disabled ? '#cbd5e1' : backgroundColor,
          borderWidth,
          borderColor,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
