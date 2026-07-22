import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginHeaderBackground } from '../../components/auth/LoginHeaderBackground';
import { colors } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useIsFocused } from '@react-navigation/native';
import {
  formatPhoneNumber,
  getPhoneDisplayParts,
  getFormattedMaxLength,
} from '../../utils/phoneUtils';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const animateLayout = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

// ─── Static Logo Component (Defined outside render to prevent flickering) ───
const Logo = ({ size = 60, style }: { size?: number; style?: any }) => (
  <Image
    source={require('../../../assets/logo.png')}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
  />
);

type Props = NativeStackScreenProps<AuthStackParamList, 'MobileLogin'>;

export const MobileLoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const isFocusedScreen = useIsFocused();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuth = useAuthStore((state) => state.setAuth);
  const phoneInputRef = useRef<TextInput>(null);

  // Synchronize layout animations frame-by-frame with keyboard transitions
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShow = Keyboard.addListener(showEvent, () => {
      if (isFocusedScreen) {
        animateLayout();
      }
    });
    const keyboardHide = Keyboard.addListener(hideEvent, () => {
      if (isFocusedScreen) {
        animateLayout();
      }
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, [isFocusedScreen]);

  // Auto-dismiss errors after 4 seconds
  useEffect(() => {
    if (error && isFocusedScreen) {
      const timer = setTimeout(() => {
        animateLayout();
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, isFocusedScreen]);

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    let finalPhone = digits;

    // Extract 10-digit number from standard prefixed entry
    if (digits.startsWith('91') && digits.length === 12) {
      finalPhone = digits.slice(2);
    }

    if (!finalPhone || finalPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authApi.sendOtp(finalPhone);
      navigation.navigate('OtpVerification', { phone: finalPhone });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async () => {
    if (!email || !password) {
      setError('Please enter both staff ID and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      setAuth(res.user, res.token, res.shops[0]);
    } catch (err: any) {
      setError(err.message || 'Staff login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const collapsedHeader = isPhoneMode || isStaffMode;

  // Header Heights: Main page is expanded to 35% height, active phone/staff mode is collapsed to 150px
  const headerHeight = collapsedHeader ? 150 : screenHeight * 0.35;

  const phoneDisplay = getPhoneDisplayParts(phone);
  const maxLimit = getFormattedMaxLength(phone);
  const isMaxReached = phone.length >= maxLimit;

  // Animation Toggle Controls
  const showSocial = !isPhoneMode && !isStaffMode;
  const showPhone = !isStaffMode;
  const showStaff = isStaffMode;
  const showStaffTrigger = !isPhoneMode && !isStaffMode;

  // Exact measurement values mapping to prevent snapping slack layout jitter
  const socialSectionHeight = showSocial ? 122 : 0;
  const phoneSectionHeight = showPhone ? (isPhoneMode ? 172 : 144) : 0;
  const staffSectionHeight = showStaff ? 265 : 0;
  const staffTriggerHeight = showStaffTrigger ? 120 : 0; // Adjusted to accommodate larger marginTop of 56

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Red Hero Header Section (Bleeds into Notch) */}
      <View style={[styles.headerBlock, { height: headerHeight }]}>
        <LoginHeaderBackground collapsed={collapsedHeader} />

        {/* Notch-safe Header Overlay */}
        <View
          style={[
            styles.headerContent,
            {
              paddingTop: insets.top,
              height: '100%',
            },
          ]}
        >
          {/* Header Row containing Back button and mini branding */}
          <View style={styles.headerRow}>
            {/* Show Back Button if in Phone Typing Mode or Staff Mode */}
            {isPhoneMode || isStaffMode ? (
              <TouchableOpacity
                onPress={() => {
                  // Batched simultaneous transitions
                  animateLayout();
                  setIsPhoneMode(false);
                  setIsStaffMode(false);
                  phoneInputRef.current?.blur();
                  Keyboard.dismiss();
                  setError('');
                }}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}

            {collapsedHeader ? (
              <View style={styles.miniBranding}>
                <Logo size={60} style={{ marginRight: -26, marginLeft: -26 }} />
                <Text style={styles.miniBrandText}>hopso</Text>
              </View>
            ) : (
              <View style={{ width: 40 }} />
            )}

            <View style={{ width: 40 }} />
          </View>

          {/* Large Logo branding centered vertically & horizontally inside red section */}
          {!collapsedHeader && (
            <View style={styles.largeBrandingContainer}>
              <View style={styles.largeBranding}>
                <Logo size={108} style={{ marginRight: -48, marginLeft: -48 }} />
                <Text style={styles.largeBrandText}>hopso</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Bottom White Card Section overlapping the red header */}
      <View style={[styles.card, styles.cardExpanded]}>
        <View style={styles.cardContentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            {/* Always-mounted smoothly animated error container */}
            <View
              style={[
                styles.errorContainer,
                {
                  height: error ? 'auto' : 0,
                  opacity: error ? 1 : 0,
                  marginBottom: error ? 16 : 0,
                  paddingVertical: error ? 12 : 0,
                  borderWidth: error ? 1 : 0,
                },
              ]}
            >
              <Text style={styles.errorText}>{error}</Text>
            </View>

            {/* PHONE / SOCIAL LOGIN PANEL (Placed at the top) */}
            <View style={styles.formPanel}>
              {/* Google & Apple Social Login Section (Smoothly height/opacity toggled) */}
              <View
                style={[
                  styles.animatedSection,
                  {
                    height: socialSectionHeight,
                    opacity: showSocial ? 1 : 0,
                  },
                ]}
                pointerEvents={showSocial ? 'auto' : 'none'}
              >
                <Text style={styles.labelText}>Login With</Text>
                <View style={styles.socialButtonsRow}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={18} color="#0f172a" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={18} color="#0f172a" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
              </View>

              {/* Phone Input */}
              <View
                style={[
                  styles.animatedSection,
                  {
                    height: phoneSectionHeight,
                    opacity: showPhone ? 1 : 0,
                  },
                ]}
                pointerEvents={showPhone ? 'auto' : 'none'}
              >
                {isPhoneMode && <Text style={styles.labelText}>Login With Phone</Text>}

                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  
                  <View style={styles.inputWrapper}>
                    <View style={styles.displayMirror}>
                      {!phone ? (
                        <Text style={styles.mirrorPlaceholder}>
                          {isPhoneMode ? 'With country code' : 'Phone number with country code'}
                        </Text>
                      ) : (
                        <Text style={styles.mirrorText} numberOfLines={1}>
                          <Text style={styles.mirrorPrefix}>{phoneDisplay.prefix}</Text>
                          <Text style={styles.mirrorRest}>{phoneDisplay.rest}</Text>
                        </Text>
                      )}
                    </View>

                    <TextInput
                      ref={phoneInputRef}
                      style={styles.realInput}
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={(val) => {
                        const formatted = formatPhoneNumber(val);
                        setPhone(formatted);
                        if (error) setError('');
                      }}
                      onFocus={() => {
                        if (!isPhoneMode) {
                          animateLayout();
                          setIsPhoneMode(true);
                        }
                      }}
                      maxLength={maxLimit}
                      caretHidden={isMaxReached}
                      selectionColor={isMaxReached ? 'transparent' : '#e70b24'}
                      placeholder=""
                    />
                  </View>
                </View>

                <Text style={styles.hintText}>
                  We'll send you a 6-digit OTP to verify your number
                </Text>

                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={loading}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* STAFF LOGIN PANEL (Smoothly height/opacity toggled) - Placed below Phone/Social Panel to prevent overlap collision */}
            <View
              style={[
                styles.animatedSection,
                {
                  height: staffSectionHeight,
                  opacity: showStaff ? 1 : 0,
                  marginTop: showStaff ? 10 : 0,
                },
              ]}
              pointerEvents={showStaff ? 'auto' : 'none'}
            >
              <Text style={styles.labelText}>Staff Login</Text>

              {/* Staff ID / Email */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Staff ID or email address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (error) setError('');
                  }}
                />
              </View>

              {/* Password */}
              <View style={[styles.inputContainer, { marginBottom: 12 }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (error) setError('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>

              {/* Options Row - Positioned closer to Password field than login button */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeGroup}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleStaffLogin}
                disabled={loading}
                style={styles.submitButton}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Staff Login Trigger (Smoothly height/opacity toggled) - Placed below Staff Login Panel */}
            <View
              style={[
                styles.animatedSection,
                {
                  height: staffTriggerHeight,
                  opacity: showStaffTrigger ? 1 : 0,
                },
              ]}
              pointerEvents={showStaffTrigger ? 'auto' : 'none'}
            >
              <TouchableOpacity
                onPress={() => {
                  animateLayout();
                  setIsStaffMode(true);
                  setError('');
                }}
                style={styles.staffLoginTrigger}
              >
                <Ionicons name="person-outline" size={18} color="#64748b" />
                <View style={styles.staffTriggerTextGroup}>
                  <Text style={styles.staffTitle}>Staff Login</Text>
                  <Text style={styles.staffSubtitle}>Sign in with staff credentials</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Privacy Policy & Terms Links - Placed at the absolute bottom of ScrollView */}
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBlock: {
    width: '100%',
    position: 'relative',
  },
  headerContent: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  backButton: {
    padding: 10,
  },
  largeBrandingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeBrandText: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -2,
    color: '#ffffff',
    marginLeft: 12,
    lineHeight: 54,
  },
  miniBranding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniBrandText: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#ffffff',
    marginLeft: 6,
    lineHeight: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  cardExpanded: {
    flex: 1,
  },
  cardContentWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  formPanel: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  animatedSection: {
    overflow: 'hidden',
    width: '100%',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  socialIcon: {
    marginRight: 2,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8, // Reduced divider margin bottom to pull phone field closer on main page
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    height: '100%',
    justifyContent: 'center',
  },
  displayMirror: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  mirrorPlaceholder: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  mirrorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mirrorPrefix: {
    color: '#94a3b8',
  },
  mirrorRest: {
    color: '#0f172a',
  },
  realInput: {
    flex: 1,
    color: 'transparent',
    height: '100%',
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 13,
  },
  eyeIcon: {
    padding: 8,
  },
  hintText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: -8,
    marginBottom: 24,
  },
  submitButton: {
    height: 48,
    backgroundColor: '#e70b24',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
  },
  footerLinkText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerLinkDivider: {
    fontSize: 12,
    color: '#e2e8f0',
    marginHorizontal: 8,
  },
  staffLoginTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginTop: 56,
    gap: 12,
  },
  staffTriggerTextGroup: {
    flex: 1,
  },
  staffTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  staffSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 22,
  },
  rememberMeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#e70b24',
    borderColor: '#e70b24',
  },
  rememberMeText: {
    fontSize: 13,
    color: '#334155',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#e70b24',
    fontWeight: '500',
  },
});
