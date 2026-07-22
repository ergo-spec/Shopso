import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const AttendanceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const checkInTime = '09:15 AM';
  const shiftDuration = '5h 45m';

  // Sample weekly attendance log data
  const attendanceLogs = [
    { date: 'Today, 22 Jul', checkIn: '09:15 AM', checkOut: 'In Progress', hours: '5h 45m', status: 'present' },
    { date: 'Mon, 21 Jul', checkIn: '09:00 AM', checkOut: '08:30 PM', hours: '11h 30m', status: 'present' },
    { date: 'Sun, 20 Jul', checkIn: '09:05 AM', checkOut: '08:00 PM', hours: '10h 55m', status: 'present' },
    { date: 'Sat, 19 Jul', checkIn: '09:12 AM', checkOut: '08:15 PM', hours: '11h 03m', status: 'present' },
    { date: 'Fri, 18 Jul', checkIn: '09:30 AM', checkOut: '08:30 PM', hours: '11h 00m', status: 'late' },
    { date: 'Thu, 17 Jul', checkIn: 'Weekly Off', checkOut: 'Weekly Off', hours: '0h 00m', status: 'off' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerTop}>
          <View style={styles.appBranding}>
            <Image
              source={require('../../../assets/app-icon.png')}
              style={styles.appLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerPageTitle}>Attendance</Text>
          </View>

          <View style={styles.locationBadge}>
            <Ionicons name="location" size={12} color="#059669" />
            <Text style={styles.locationBadgeText}>On-Site</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Check In / Check Out Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.statusLiveIndicator}>
              <View style={[styles.liveDot, { backgroundColor: isCheckedIn ? '#059669' : '#94a3b8' }]} />
              <Text style={styles.liveStatusText}>
                {isCheckedIn ? 'Shift Active' : 'Not Checked In'}
              </Text>
            </View>

            {isCheckedIn && (
              <Text style={styles.shiftDurationText}>Duration: {shiftDuration}</Text>
            )}
          </View>

          <View style={styles.timeInfoRow}>
            <View style={styles.timeInfoCell}>
              <Text style={styles.timeLabel}>Check In Time</Text>
              <Text style={styles.timeValue}>{isCheckedIn ? checkInTime : '--:--'}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.timeInfoCell}>
              <Text style={styles.timeLabel}>Target Shift</Text>
              <Text style={styles.timeValue}>09:00 AM - 08:30 PM</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isCheckedIn ? '#dc2626' : '#059669' },
            ]}
            onPress={() => setIsCheckedIn(!isCheckedIn)}
            activeOpacity={0.85}
          >
            <Ionicons name={isCheckedIn ? 'log-out-outline' : 'log-in-outline'} size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>
              {isCheckedIn ? 'Check Out for Today' : 'Check In Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Logs List */}
        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>Recent Attendance Logs</Text>

          <View style={styles.logsCardContainer}>
            {attendanceLogs.map((log, index) => (
              <View
                key={log.date}
                style={[styles.logRowItem, index > 0 && styles.topBorderLine]}
              >
                <View style={styles.logLeftCol}>
                  <Text style={styles.logDateText}>{log.date}</Text>

                  <View style={styles.logTimeSpanRow}>
                    <Text style={styles.logTimeSpanText}>
                      {log.checkIn} → {log.checkOut}
                    </Text>
                  </View>
                </View>

                <View style={styles.logRightCol}>
                  <Text style={styles.logHoursText}>{log.hours}</Text>

                  <View
                    style={[
                      styles.statusPill,
                      log.status === 'present' && styles.statusPresent,
                      log.status === 'late' && styles.statusLate,
                      log.status === 'off' && styles.statusOff,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        log.status === 'present' && styles.statusPresentText,
                        log.status === 'late' && styles.statusLateText,
                        log.status === 'off' && styles.statusOffText,
                      ]}
                    >
                      {log.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
    gap: 10,
  },
  appLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  headerPageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for floating pill tab bar
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  shiftDurationText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timeInfoCell: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },
  timeLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  logsSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  logsCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  logRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBorderLine: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  logLeftCol: {
    flex: 1,
  },
  logDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  logTimeSpanRow: {
    marginTop: 2,
  },
  logTimeSpanText: {
    fontSize: 11,
    color: '#64748b',
  },
  logRightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  logHoursText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPresent: {
    backgroundColor: '#dcfce7',
  },
  statusLate: {
    backgroundColor: '#fef3c7',
  },
  statusOff: {
    backgroundColor: '#f1f5f9',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  statusPresentText: {
    color: '#15803d',
  },
  statusLateText: {
    color: '#b45309',
  },
  statusOffText: {
    color: '#64748b',
  },
});
