import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StaffTabParamList, StaffStackParamList } from './types';
import { EntryScreen } from '../screens/staff/EntryScreen';
import { HistoryScreen } from '../screens/staff/HistoryScreen';
import { AttendanceScreen } from '../screens/staff/AttendanceScreen';
import { MoreScreen } from '../screens/staff/MoreScreen';
import { PendingDsrScreen } from '../screens/staff/PendingDsrScreen';
import { CreateEntryScreen } from '../screens/staff/CreateEntryScreen';

const Tab = createBottomTabNavigator<StaffTabParamList>();
const Stack = createNativeStackNavigator<StaffStackParamList>();

/* Custom Floating Curved Pill Tab Bar Component */
const CustomPillTabBar: React.FC<BottomTabBarProps & { onOpenEntryModal: () => void }> = ({
  state,
  descriptors,
  navigation,
  onOpenEntryModal,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.pillTabBarContainer, { bottom: insets.bottom + 8 }]}>
      {/* Elevated Off-Axis Center Plus Button */}
      <View style={styles.curvedCollarWrapper} pointerEvents="box-none">
        <View style={styles.whiteCollarRing}>
          <TouchableOpacity
            style={styles.offAxisPlusButton}
            onPress={onOpenEntryModal}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Items Row: Entry -> Attendance -> (+) -> History -> Account */}
      <View style={styles.tabItemsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'AddEntryAction') {
              onOpenEntryModal();
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Dummy center space for elevated button
          if (route.name === 'AddEntryAction') {
            return (
              <View key={route.key} style={styles.tabItem} pointerEvents="none" />
            );
          }

          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
          let label = 'Tab';

          if (route.name === 'Entry') {
            iconName = isFocused ? 'grid' : 'grid-outline';
            label = 'Entry';
          } else if (route.name === 'Attendance') {
            iconName = isFocused ? 'calendar' : 'calendar-outline';
            label = 'Attendance';
          } else if (route.name === 'History') {
            iconName = isFocused ? 'time' : 'time-outline';
            label = 'History';
          } else if (route.name === 'Account') {
            iconName = isFocused ? 'person-circle' : 'person-circle-outline';
            label = 'Account';
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={isFocused ? '#e70b24' : '#94a3b8'}
              />
              <Text
                style={[
                  styles.tabLabelText,
                  { color: isFocused ? '#e70b24' : '#94a3b8' },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const StaffTabNavigator = () => {
  const stackNavigation = useNavigation<NativeStackNavigationProp<StaffStackParamList>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  const openModal = useCallback(() => {
    setIsModalVisible(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 22,
        stiffness: 260,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: Dimensions.get('window').height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsModalVisible(false));
  }, [backdropOpacity, sheetTranslateY]);

  const entryCategories = [
    {
      id: 'inventory' as const,
      title: 'Inventory',
      icon: 'cube-outline',
      color: '#0284c7',
      bgColor: '#e0f2fe',
      subTypes: [
        { label: 'Purchase', color: '#0284c7', bg: '#f0f9ff' },
        { label: 'Sale', color: '#059669', bg: '#ecfdf5' },
      ],
    },
    {
      id: 'transaction' as const,
      title: 'Transaction',
      icon: 'receipt-outline',
      color: '#059669',
      bgColor: '#dcfce7',
      subTypes: [
        { label: 'Expense', color: '#dc2626', bg: '#fef2f2' },
        { label: 'Income', color: '#059669', bg: '#ecfdf5' },
      ],
    },
    {
      id: 'vendor' as const,
      title: 'Vendor',
      icon: 'storefront-outline',
      color: '#d97706',
      bgColor: '#fef3c7',
      subTypes: [
        { label: 'Paid', color: '#dc2626', bg: '#fef2f2' },
        { label: 'Received', color: '#059669', bg: '#ecfdf5' },
      ],
    },
    {
      id: 'partner' as const,
      title: 'Partner',
      icon: 'people-outline',
      color: '#7c3aed',
      bgColor: '#f3e8ff',
      subTypes: [
        { label: 'Paid', color: '#dc2626', bg: '#fef2f2' },
        { label: 'Received', color: '#059669', bg: '#ecfdf5' },
      ],
    },
    {
      id: 'transfer' as const,
      title: 'Transfer',
      icon: 'swap-horizontal-outline',
      color: '#2563eb',
      bgColor: '#dbeafe',
      subTypes: [
        { label: 'Transfer', color: '#2563eb', bg: '#eff6ff' },
      ],
    },
  ];

  const handleDirectSubTypeSelect = (category: string, subType: string) => {
    closeModal();
    setTimeout(() => stackNavigation.navigate('CreateEntry', { category, subType }), 220);
  };

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <CustomPillTabBar {...props} onOpenEntryModal={openModal} />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Entry" component={EntryScreen} />
        <Tab.Screen name="Attendance" component={AttendanceScreen} />
        <Tab.Screen name="AddEntryAction" component={EntryScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Account" component={MoreScreen} />
      </Tab.Navigator>

      {/* GLOBAL DIRECT 1-TAP ENTRY SELECTION MODAL */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop: fades in/out only */}
          <Animated.View
            style={[styles.modalBackdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={closeModal}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Sheet: slides up from bottom */}
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            {/* Drag Handle Bar */}
            <View style={styles.dragHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Entry Type</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Direct 1-Tap Category Rows with Inline Sub-Type Buttons */}
            <View style={styles.categoryListContainer}>
              {entryCategories.map((cat) => (
                <View key={cat.id} style={styles.categoryRowItem}>
                  {/* Left: Category Icon & Semi-Bold Title */}
                  <View style={styles.categoryTitleGroup}>
                    <View style={[styles.categoryIconCircle, { backgroundColor: cat.bgColor }]}>
                      <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                    </View>
                    <Text style={styles.categoryItemTitle}>{cat.title}</Text>
                  </View>

                  {/* Right: Direct Uniform-Sized Sub-Type Action Chips */}
                  <View style={styles.subTypeButtonsRow}>
                    {cat.subTypes.map((st) => (
                      <TouchableOpacity
                        key={st.label}
                        style={[styles.directSubTypeChip, { backgroundColor: st.bg }]}
                        onPress={() => handleDirectSubTypeSelect(cat.id, st.label)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="add" size={13} color={st.color} />
                        <Text style={[styles.directSubTypeChipText, { color: st.color }]}>
                          {st.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export const StaffNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffTabs" component={StaffTabNavigator} />
      <Stack.Screen name="PendingDsr" component={PendingDsrScreen} />
      <Stack.Screen name="CreateEntry" component={CreateEntryScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  /* Floating Pill Tab Bar Container */
  pillTabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  /* Curved White Collar Ring framing the elevated off-axis button */
  curvedCollarWrapper: {
    position: 'absolute',
    top: -18,
    alignSelf: 'center',
    zIndex: 10,
  },
  whiteCollarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offAxisPlusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e70b24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e70b24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },

  /* Tab Items Row */
  tabItemsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabelText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  bottomSheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  dragHandle: {
    width: 34,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600', // Semi-bold heading
    color: '#0f172a',
  },
  closeModalButton: {
    padding: 4,
  },

  /* Direct 1-Tap Category Rows */
  categoryListContainer: {
    gap: 8,
  },
  categoryRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItemTitle: {
    fontSize: 14,
    fontWeight: '600', // Semi-bold entry category heading
    color: '#0f172a',
  },
  subTypeButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directSubTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 78, // Ensures Sale chip is the exact same size as Income / Expense / Purchase chips!
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  directSubTypeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
