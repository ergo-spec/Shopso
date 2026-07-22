import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  collapsed?: boolean;
}

export const LoginHeaderBackground: React.FC<Props> = ({ collapsed = false }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Red header featuring a rich gradient for color depth and a background grid
  return (
    <LinearGradient
      colors={['#ef1c35', '#b9071a']} // Premium red gradient with depth
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      {/* Grid Pattern Overlay using thin absolute lines */}
      {!collapsed && (
        <View style={styles.gridContainer} pointerEvents="none">
          {/* Vertical grid lines */}
          {Array.from({ length: 14 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineVertical,
                { left: i * (screenWidth / 10) },
              ]}
            />
          ))}
          {/* Horizontal grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineHorizontal,
                { top: i * 36 },
              ]}
            />
          ))}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: '100%',
    height: '100%', // Fills parent container completely (prevents different bottom color)
    position: 'relative',
    overflow: 'visible',
  },
  gridContainer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.08,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.8,
    backgroundColor: '#ffffff',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.8,
    backgroundColor: '#ffffff',
  },
});
