import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StaffStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<StaffStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_GAP = 12; // Gap spacing between swipable cards

export const EntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  // In production, this checks if any previous day DSR is pending submission
  const [hasPendingDsr, setHasPendingDsr] = useState(true);
  const pendingCount = 10;
  const oldestPendingDate = '12 Jul 2026';
  const newestPendingDate = '21 Jul 2026';

  // Active slide index for Swipable Metrics / Accounts Card
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Today's Live DSR Metrics
  const todayDsrMetrics = {
    sale: 18450,
    income: 2500,
    expense: 450,
    credit: 1200,
    net: 20500, // (Sale + Income - Expense)
  };

  // Multiple Shop Accounts
  const shopAccounts = [
    { name: 'Cash in Hand (Drawer)', balance: 8450, color: '#059669', icon: 'wallet-outline' },
    { name: 'HDFC Bank (UPI / Card)', balance: 6850, color: '#0284c7', icon: 'card-outline' },
    { name: 'ICICI Bank Account', balance: 2400, color: '#0284c7', icon: 'business-outline' },
    { name: 'Paytm QR Business', balance: 1150, color: '#0284c7', icon: 'qr-code-outline' },
    { name: 'PhonePe Merchant', balance: 450, color: '#0284c7', icon: 'phone-portrait-outline' },
    { name: 'Petty Cash Box', balance: 1200, color: '#d97706', icon: 'archive-outline' },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const snapInterval = CARD_WIDTH + CARD_GAP;
    const index = Math.round(contentOffset / snapInterval);
    if (index !== activeSlideIndex && (index === 0 || index === 1)) {
      setActiveSlideIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Pure White Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerTop}>
          {/* App Icon — self-contained brand mark */}
          <View style={styles.appBranding}>
            <Image
              source={require('../../../assets/app-icon.png')}
              style={styles.appLogo}
              resizeMode="contain"
            />
          </View>

          {/* Dev Demo Toggle to test both states */}
          <TouchableOpacity
            style={styles.demoToggle}
            onPress={() => setHasPendingDsr(!hasPendingDsr)}
          >
            <Text style={styles.demoToggleText}>
              {hasPendingDsr ? 'Dev: Clear DSRs' : 'Dev: Lock DSRs'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 1: Framed Soft Border Container */}
      {hasPendingDsr ? (
        /* STATE A: Pending DSR Action Required Section with Soft Border */
        <View style={styles.framedPendingSection}>
          {/* Line 1: Subtle Amber Action Required Pill */}
          <View style={styles.topActionTagRow}>
            <View style={styles.actionRequiredBadge}>
              <Ionicons name="ellipse" size={6} color="#d97706" />
              <Text style={styles.actionRequiredBadgeText}>Action Required</Text>
            </View>
          </View>

          {/* Line 2: Pending DSR Title Line */}
          <Text style={styles.cardTitleLine}>
            Pending DSR <Text style={styles.subtleDaysText}>{pendingCount} Days</Text>
          </Text>

          {/* Line 3: Dates Span Line */}
          <Text style={styles.cardDatesLine}>
            From {oldestPendingDate} to {newestPendingDate}
          </Text>

          {/* Line Divider */}
          <View style={styles.linkDivider} />

          {/* Line 4: Red Accent Text Link */}
          <TouchableOpacity
            style={styles.cardActionLink}
            onPress={() => navigation.navigate('PendingDsr')}
            activeOpacity={0.7}
          >
            <Text style={styles.cardActionLinkText}>Review & Submit</Text>
            <Ionicons name="arrow-forward" size={16} color="#e70b24" />
          </TouchableOpacity>
        </View>
      ) : (
        /* STATE B: Spacious Swipable Metrics & Accounts Carousel Card */
        <View style={styles.swipableContainer}>
          <ScrollView
            horizontal
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: CARD_WIDTH }}
          >
            {/* SLIDE 1: Today's Financial Metrics Grid */}
            <View style={[styles.framedMetricsSection, { width: CARD_WIDTH, marginRight: CARD_GAP }]}>
              <View style={styles.gridRow}>
                <View style={[styles.gridCellCenter, styles.rightInnerBorder]}>
                  <Text style={styles.metricLabel}>Sale</Text>
                  <Text style={styles.metricValueSmall}>
                    <Text style={styles.currencySymbol}>₹ </Text>
                    <Text style={{ color: '#059669' }}>
                      {todayDsrMetrics.sale.toLocaleString('en-IN')}
                    </Text>
                  </Text>
                </View>

                <View style={styles.gridCellCenter}>
                  <Text style={styles.metricLabel}>Income</Text>
                  <Text style={styles.metricValueSmall}>
                    <Text style={styles.currencySymbol}>₹ </Text>
                    <Text style={{ color: '#0284c7' }}>
                      {todayDsrMetrics.income.toLocaleString('en-IN')}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={[styles.gridRow, styles.topInnerBorder]}>
                <View style={[styles.gridCellCenter, styles.rightInnerBorder]}>
                  <Text style={styles.metricLabel}>Expense</Text>
                  <Text style={styles.metricValueSmall}>
                    <Text style={styles.currencySymbol}>₹ </Text>
                    <Text style={{ color: '#dc2626' }}>
                      {todayDsrMetrics.expense.toLocaleString('en-IN')}
                    </Text>
                  </Text>
                </View>

                <View style={styles.gridCellCenter}>
                  <Text style={styles.metricLabel}>Credit</Text>
                  <Text style={styles.metricValueSmall}>
                    <Text style={styles.currencySymbol}>₹ </Text>
                    <Text style={{ color: '#d97706' }}>
                      {todayDsrMetrics.credit.toLocaleString('en-IN')}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Compact Grey Footer Row */}
              <View style={[styles.netGridRow, styles.topInnerBorder]}>
                <Text style={styles.netLabel}>Net Total</Text>
                <Text style={styles.netValueSmall}>
                  <Text style={styles.currencySymbol}>₹ </Text>
                  <Text style={{ color: '#0f172a' }}>
                    {todayDsrMetrics.net.toLocaleString('en-IN')}
                  </Text>
                </Text>
              </View>
            </View>

            {/* SLIDE 2: Clean Accounts List (4 Accounts visible at once at max) */}
            <View style={[styles.framedMetricsSection, { width: CARD_WIDTH }]}>
              {/* Vertically Scrollable Accounts List */}
              <ScrollView
                nestedScrollEnabled
                persistentScrollbar={true}
                showsVerticalScrollIndicator={true}
                indicatorStyle="black"
                style={styles.accountsScrollList}
              >
                {shopAccounts.map((account, index) => (
                  <View
                    key={account.name}
                    style={[
                      styles.accountRow,
                      index > 0 && styles.topInnerBorder,
                    ]}
                  >
                    <View style={styles.accountNameRow}>
                      <Ionicons
                        name={account.icon as any}
                        size={13}
                        color={account.color}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.accountNameLabel}>{account.name}</Text>
                    </View>
                    <Text style={styles.metricValueSmall}>
                      <Text style={styles.currencySymbol}>₹ </Text>
                      <Text style={{ color: account.color }}>
                        {account.balance.toLocaleString('en-IN')}
                      </Text>
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Compact Grey Footer Row */}
              <View style={[styles.netGridRow, styles.topInnerBorder]}>
                <Text style={styles.netLabel}>Total Expected Balance</Text>
                <Text style={styles.netValueSmall}>
                  <Text style={styles.currencySymbol}>₹ </Text>
                  <Text style={{ color: '#0f172a' }}>
                    {todayDsrMetrics.net.toLocaleString('en-IN')}
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Height Outside Footer Row */}
          <View style={styles.outsideFooterBar}>
            {/* Left Equal Spacer */}
            <View style={styles.footerFlexColumn} />

            {/* Center Pagination Dots */}
            <View style={styles.paginationRow}>
              <View
                style={[
                  styles.paginationDot,
                  activeSlideIndex === 0 && styles.paginationDotActive,
                ]}
              />
              <View
                style={[
                  styles.paginationDot,
                  activeSlideIndex === 1 && styles.paginationDotActive,
                ]}
              />
            </View>

            {/* Right Side Subtle Scroll Hint (Fixed Container, Zero Layout Shift) */}
            <View style={[styles.footerFlexColumn, styles.alignRight]}>
              <View
                style={[
                  styles.subtleOutsideScrollHint,
                  { opacity: activeSlideIndex === 1 ? 1 : 0 },
                ]}
              >
                <Ionicons name="swap-vertical" size={9} color="#94a3b8" />
                <Text style={styles.subtleOutsideScrollText}>Scroll for more</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 2: Today's Entries Area */}
        <View style={styles.entrySectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Entries</Text>
          </View>

          {hasPendingDsr ? (
            /* Locked State Card */
            <View style={styles.lockedEntryBox}>
              <Ionicons name="lock-closed-outline" size={32} color="#94a3b8" />
              <Text style={styles.lockedTitle}>Entry Locked</Text>
              <Text style={styles.lockedSubtitle}>
                Complete pending day closures above to enable new transaction entry.
              </Text>
            </View>
          ) : (
            /* Unlocked State: Empty State Hint */
            <View style={styles.unlockedEntriesContainer}>
              <Ionicons name="document-text-outline" size={32} color="#cbd5e1" />
              <Text style={styles.noEntriesTitle}>No Entries Logged Today</Text>
              <Text style={styles.noEntriesSubtitle}>
                Tap the '+' button in the navigation bar below to record a new transaction.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBranding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  demoToggle: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  demoToggleText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 84, // Safe padding above floating pill tab bar
    gap: 16,
    backgroundColor: '#ffffff',
  },

  /* Framed Soft Border Pending Section */
  framedPendingSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topActionTagRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionRequiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  actionRequiredBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b45309',
  },
  cardTitleLine: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  subtleDaysText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  cardDatesLine: {
    fontSize: 11,
    fontWeight: '500',
    color: '#a1a1aa',
    marginTop: 4,
    marginBottom: 12,
  },

  /* Spacious Swipable Carousel Styles */
  swipableContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  framedMetricsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    height: 168,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
  },
  gridCellCenter: {
    width: '50%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Slide 2 Accounts Scroll List Styles */
  accountsScrollList: {
    maxHeight: 132,
    paddingRight: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  accountNameLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  topInnerBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  rightInnerBorder: {
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValueSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  currencySymbol: {
    color: '#94a3b8',
    fontWeight: '400',
    fontSize: 13,
  },
  netGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  netLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  netValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* Outside Fixed-Height 3-Column Flex Footer Row */
  outsideFooterBar: {
    width: '100%',
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  footerFlexColumn: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: '#0f172a',
  },
  subtleOutsideScrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  subtleOutsideScrollText: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '500',
  },

  /* Link & Section 2 Styles */
  linkDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 12,
  },
  cardActionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cardActionLinkText: {
    color: '#e70b24',
    fontSize: 14,
    fontWeight: '700',
  },
  entrySectionContainer: {
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  lockedEntryBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  lockedSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  unlockedEntriesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noEntriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
  },
  noEntriesSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});
