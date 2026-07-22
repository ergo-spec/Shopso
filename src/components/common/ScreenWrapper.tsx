import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  dark?: boolean;
  refreshControl?: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  dark = false,
  refreshControl,
}) => {
  const activeColors = dark ? colors.dark : colors.light;

  const content = scrollable ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl as any}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }, style]}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={activeColors.background}
      />
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
