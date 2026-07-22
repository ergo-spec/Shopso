import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

export const MoreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const activeShop = useAuthStore((state) => state.activeShop);

  // Feedback Modal State
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Rate App Modal State
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [hasRated, setHasRated] = useState(false);

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Feedback Empty', 'Please enter your feedback or suggestions before submitting.');
      return;
    }
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setIsFeedbackModalVisible(false);
      setFeedbackText('');
      Alert.alert('Thank You!', 'Your feedback has been received. We appreciate your input to make Shopso better!');
    }, 500);
  };

  const handleSubmitRating = () => {
    setHasRated(true);
    setTimeout(() => {
      setIsRateModalVisible(false);
      Alert.alert('Rating Submitted', `Thank you for rating us ${rating} stars!`);
    }, 400);
  };

  const staffName = user?.name || 'Staff Member';
  const staffEmail = user?.email || 'staff@shopso.app';
  const staffRole = user?.role || 'STAFF';
  const shopName = activeShop?.name || 'Main Retail Branch';
  const shopAddress = activeShop?.address || 'City Center, Suite 101';
  const shopPhone = activeShop?.phone || '+91 98765 43210';

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
            <Text style={styles.headerPageTitle}>Account & Settings</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Staff Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{staffName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileTextGroup}>
              <Text style={styles.staffNameText}>{staffName}</Text>
              <Text style={styles.staffEmailText}>{staffEmail}</Text>
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#0284c7" />
                <Text style={styles.roleBadgeText}>{staffRole}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Active Store Info Card (Compact) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>ACTIVE STORE DETAILS</Text>
          <View style={styles.compactCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircleBlue}>
                <Ionicons name="storefront-outline" size={15} color="#0284c7" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Shop Name</Text>
                <Text style={styles.infoValue}>{shopName}</Text>
              </View>
            </View>

            <View style={styles.compactDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircleGreen}>
                <Ionicons name="location-outline" size={15} color="#059669" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location / Address</Text>
                <Text style={styles.infoValue}>{shopAddress}</Text>
              </View>
            </View>

            <View style={styles.compactDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCirclePurple}>
                <Ionicons name="call-outline" size={15} color="#7c3aed" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>{shopPhone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Support & Feedback Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>FEEDBACK & APP RATING</Text>
          <View style={styles.cardNoPadding}>
            {/* Feedback Option */}
            <TouchableOpacity
              style={styles.menuOptionRow}
              onPress={() => setIsFeedbackModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuOptionLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="chatbox-ellipses-outline" size={18} color="#2563eb" />
                </View>
                <View>
                  <Text style={styles.menuOptionTitle}>Send Feedback</Text>
                  <Text style={styles.menuOptionSubtitle}>Share thoughts or report issues</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.dividerIndent} />

            {/* Rate App Option */}
            <TouchableOpacity
              style={styles.menuOptionRow}
              onPress={() => setIsRateModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuOptionLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="star-outline" size={18} color="#d97706" />
                </View>
                <View>
                  <Text style={styles.menuOptionTitle}>Rate Shopso App</Text>
                  <Text style={styles.menuOptionSubtitle}>
                    {hasRated ? `You rated ${rating} ★` : 'Leave us a rating'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#ffffff" />
          <Text style={styles.logoutButtonText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.appVersionText}>Shopso App • Version 1.0.0</Text>
      </ScrollView>

      {/* FEEDBACK MODAL */}
      <Modal
        visible={isFeedbackModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsFeedbackModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setIsFeedbackModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={() => setIsFeedbackModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              We value your input! Let us know how we can improve your shop management experience.
            </Text>

            <TextInput
              style={styles.feedbackInput}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Type your feedback, suggestion, or issue here..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.modalSubmitButton, isSubmittingFeedback && styles.buttonDisabled]}
              onPress={handleSendFeedback}
              disabled={isSubmittingFeedback}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={16} color="#ffffff" />
              <Text style={styles.modalSubmitText}>
                {isSubmittingFeedback ? 'Sending...' : 'Submit Feedback'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RATE APP MODAL */}
      <Modal
        visible={isRateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsRateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setIsRateModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Rate Shopso App</Text>
              <TouchableOpacity onPress={() => setIsRateModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              How has your experience with Shopso been? Tap stars to rate!
            </Text>

            {/* Interactive Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <TouchableOpacity
                  key={starIndex}
                  onPress={() => setRating(starIndex)}
                  activeOpacity={0.7}
                  style={styles.starTouch}
                >
                  <Ionicons
                    name={starIndex <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color={starIndex <= rating ? '#f59e0b' : '#cbd5e1'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingTextLabel}>
              {rating === 5 && 'Outstanding! 🌟'}
              {rating === 4 && 'Great Experience! 👍'}
              {rating === 3 && 'Good, but can improve! 😊'}
              {rating === 2 && 'Needs Improvement 😐'}
              {rating === 1 && 'Poor Experience 😞'}
            </Text>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSubmitRating}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.modalSubmitText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  scrollContent: {
    padding: 16,
    paddingBottom: 84,
    gap: 16,
  },
  sectionContainer: {
    gap: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  cardNoPadding: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e70b24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  profileTextGroup: {
    flex: 1,
  },
  staffNameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  staffEmailText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
  },
  compactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleBlue: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleGreen: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePurple: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 1,
  },
  compactDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 6,
  },
  dividerIndent: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 62,
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  menuOptionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: '#e70b24',
    borderRadius: 12,
    shadowColor: '#e70b24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  appVersionText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  feedbackInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
    height: 100,
    textAlignVertical: 'top',
  },
  modalSubmitButton: {
    backgroundColor: '#e70b24',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  starTouch: {
    padding: 4,
  },
  ratingTextLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
});
