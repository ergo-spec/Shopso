import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StaffStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<StaffStackParamList, 'PendingDsr'>;

interface DsrItem {
  id: string;
  date: string; // ISO format 'YYYY-MM-DD'
  formattedDate: string;
  openingCash: number;
  totalSales: number;
  totalExpenses: number;
  entriesCount: number;
  status: 'DRAFT' | 'READY_TO_SUBMIT';
}

export const PendingDsrScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // 10 Mock DSR items ordered chronologically (oldest pending date first)
  const [dsrList, setDsrList] = useState<DsrItem[]>([
    {
      id: 'dsr_2026_07_12',
      date: '2026-07-12',
      formattedDate: 'Sunday • 12 Jul 2026',
      openingCash: 1200,
      totalSales: 8900,
      totalExpenses: 200,
      entriesCount: 9,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_13',
      date: '2026-07-13',
      formattedDate: 'Monday • 13 Jul 2026',
      openingCash: 0,
      totalSales: 11200,
      totalExpenses: 150,
      entriesCount: 14,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_14',
      date: '2026-07-14',
      formattedDate: 'Tuesday • 14 Jul 2026',
      openingCash: 0,
      totalSales: 9400,
      totalExpenses: 80,
      entriesCount: 11,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_15',
      date: '2026-07-15',
      formattedDate: 'Wednesday • 15 Jul 2026',
      openingCash: 0,
      totalSales: 12800,
      totalExpenses: 310,
      entriesCount: 16,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_16',
      date: '2026-07-16',
      formattedDate: 'Thursday • 16 Jul 2026',
      openingCash: 0,
      totalSales: 10100,
      totalExpenses: 120,
      entriesCount: 13,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_17',
      date: '2026-07-17',
      formattedDate: 'Friday • 17 Jul 2026',
      openingCash: 0,
      totalSales: 15600,
      totalExpenses: 450,
      entriesCount: 21,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_18',
      date: '2026-07-18',
      formattedDate: 'Saturday • 18 Jul 2026',
      openingCash: 0,
      totalSales: 18200,
      totalExpenses: 280,
      entriesCount: 25,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_19',
      date: '2026-07-19',
      formattedDate: 'Sunday • 19 Jul 2026',
      openingCash: 0,
      totalSales: 13400,
      totalExpenses: 190,
      entriesCount: 17,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_20',
      date: '2026-07-20',
      formattedDate: 'Monday • 20 Jul 2026',
      openingCash: 0,
      totalSales: 10500,
      totalExpenses: 150,
      entriesCount: 12,
      status: 'READY_TO_SUBMIT',
    },
    {
      id: 'dsr_2026_07_21',
      date: '2026-07-21',
      formattedDate: 'Yesterday • 21 Jul 2026',
      openingCash: 0,
      totalSales: 14350,
      totalExpenses: 350,
      entriesCount: 18,
      status: 'READY_TO_SUBMIT',
    },
  ]);

  // Ensure items are strictly sorted by date ascending (chronological order)
  const sortedDsrList = [...dsrList].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleSubmitDsr = (dsr: DsrItem, index: number) => {
    // Chronological enforcement rule: Only the oldest pending DSR (index 0) can be submitted
    if (index > 0) {
      const oldestDsr = sortedDsrList[0];
      setWarningMessage(
        `Please submit DSR for ${oldestDsr.formattedDate.split('•')[1]?.trim() || oldestDsr.date} first.`
      );
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    setSubmittingId(dsr.id);

    setTimeout(() => {
      // Calculate closing cash of current submitted day
      const currentClosing = dsr.openingCash + dsr.totalSales - dsr.totalExpenses;

      // Filter out submitted item and carry forward opening cash to next day
      setDsrList((prev) => {
        const remaining = prev.filter((item) => item.id !== dsr.id);
        if (remaining.length > 0) {
          remaining[0] = {
            ...remaining[0],
            openingCash: currentClosing,
          };
        }
        return remaining;
      });

      setSubmittingId(null);
      setSuccessMessage(
        `DSR for ${dsr.formattedDate.split('•')[1]?.trim() || dsr.date} submitted successfully!`
      );

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Pure White Header Block matching page background */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>Pending DSR ({sortedDsrList.length})</Text>
            <Text style={styles.headerSubtitle}>Chronological Day Closures</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Success Toast */}
        {successMessage && (
          <View style={styles.successToast}>
            <Ionicons name="checkmark-circle" size={20} color="#166534" />
            <Text style={styles.successToastText}>{successMessage}</Text>
          </View>
        )}

        {/* Chronological Warning Toast */}
        {warningMessage && (
          <View style={styles.warningToast}>
            <Ionicons name="alert-circle" size={20} color="#991b1b" />
            <Text style={styles.warningToastText}>{warningMessage}</Text>
          </View>
        )}

        {/* Empty State */}
        {sortedDsrList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={72} color="#10b981" />
            <Text style={styles.emptyTitle}>All DSRs Submitted!</Text>
            <Text style={styles.emptySubtitle}>
              All daily sales reports have been closed. You are ready to add new entries.
            </Text>
            <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
              <Text style={styles.returnButtonText}>Back to Entry Page</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              Pending Reports ({sortedDsrList.length})
            </Text>

            {sortedDsrList.map((dsr, index) => {
              const isSubmitting = submittingId === dsr.id;
              const isLocked = index > 0; // Only index 0 (active unclosed day) is unlocked!
              const previousDsrDate =
                index > 0
                  ? sortedDsrList[index - 1].formattedDate.split('•')[1]?.trim() ||
                    sortedDsrList[index - 1].date
                  : '';

              const closingCash = dsr.openingCash + dsr.totalSales - dsr.totalExpenses;

              /* Render Super Compact Single-Row Card for Locked Days */
              if (isLocked) {
                return (
                  <TouchableOpacity
                    key={dsr.id}
                    style={styles.compactLockedCard}
                    activeOpacity={0.7}
                    onPress={() => handleSubmitDsr(dsr, index)}
                  >
                    <View style={styles.compactLockedLeft}>
                      <Ionicons name="lock-closed" size={16} color="#64748b" />
                      <Text style={styles.compactDateText}>{dsr.formattedDate}</Text>
                    </View>

                    <View style={styles.compactLockedRight}>
                      <Text style={styles.compactLockHint}>Submit {previousDsrDate} first</Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              /* Render Full Unlocked Card for Active Day (Index 0) */
              return (
                <View key={dsr.id} style={styles.dsrCard}>
                  {/* Card Header Row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.dateGroup}>
                      <Ionicons name="calendar-outline" size={18} color="#0f172a" />
                      <Text style={styles.dateText}>{dsr.formattedDate}</Text>
                    </View>

                    <View style={[styles.statusBadge, styles.statusReady]}>
                      <Text style={[styles.statusText, styles.statusReadyText]}>
                        Ready to Submit
                      </Text>
                    </View>
                  </View>

                  {/* Active Day Stats */}
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Opening Cash</Text>
                      <Text style={styles.metricValue}>
                        ₹{dsr.openingCash.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Total Sales ({dsr.entriesCount})</Text>
                      <Text style={[styles.metricValue, { color: '#059669' }]}>
                        +₹{dsr.totalSales.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Expenses</Text>
                      <Text style={[styles.metricValue, { color: '#dc2626' }]}>
                        -₹{dsr.totalExpenses.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Closing Cash</Text>
                      <Text style={[styles.metricValue, { fontWeight: '700' }]}>
                        ₹{closingCash.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {/* Action Row for Active Day */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.secondaryButton}>
                      <Ionicons name="create-outline" size={16} color="#475569" />
                      <Text style={styles.secondaryButtonText}>Edit Entries</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.primaryButton, isSubmitting && { opacity: 0.7 }]}
                      disabled={isSubmitting}
                      onPress={() => handleSubmitDsr(dsr, index)}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <>
                          <Ionicons name="paper-plane-outline" size={16} color="#ffffff" />
                          <Text style={styles.primaryButtonText}>Submit DSR</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    flex: 1,
  },
  warningToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  warningToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991b1b',
    flex: 1,
  },
  listSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dsrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusReady: {
    backgroundColor: '#dcfce7',
  },
  statusReadyText: {
    color: '#15803d',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    marginBottom: 16,
  },
  metricItem: {
    width: '50%',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#e70b24',
    borderRadius: 8,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  /* Compact Locked Card Styles */
  compactLockedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  compactLockedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactDateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  compactLockedRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactLockHint: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  returnButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderRadius: 8,
  },
  returnButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
