import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
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

// ─── Static Logo Component (Defined outside render to prevent flickering) ───
const Logo = ({ size = 30, style }: { size?: number; style?: any }) => (
  <Image
    source={require('../../../assets/logo.png')}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
  />
);

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const inputRef = useRef<TextInput>(null);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, []);

  // Auto-dismiss errors after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleVerify = async (codeOverride?: string) => {
    const code = codeOverride || otp;
    if (!code || code.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.verifyOtp(phone, code);
      setAuth(res.user, res.token, res.shops[0]);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '').substring(0, 6);
    setOtp(cleanVal);
    if (error) setError('');

    // Auto verify once 6 digits are completed
    if (cleanVal.length === 6) {
      handleVerify(cleanVal);
    }
  };

  // Keep header height fixed at 150px constantly on the OTP screen to prevent layout shifts
  const headerHeight = 150;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Red Hero Header Section matched to login page header heights */}
      <View style={[styles.headerBlock, { height: headerHeight }]}>
        <LoginHeaderBackground collapsed={true} />

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
          {/* Header Row with Back button and mini branding */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.miniBranding}>
              <Logo size={60} style={{ marginRight: -26, marginLeft: -26 }} />
              <Text style={styles.miniBrandText}>hopso</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
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

            <View style={styles.formPanel}>
              <Text style={styles.formTitle}>Enter OTP</Text>
              <Text style={styles.formSubtitle}>
                Sent to <Text style={styles.phoneBold}>+91 {phone}</Text>
              </Text>

              {/* Hidden TextInput for 6-digit OTP trigger */}
              <TextInput
                ref={inputRef}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={handleOtpChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.hiddenInput}
              />

              {/* Styled 6-digit code boxes */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                style={styles.otpBoxContainer}
              >
                {Array.from({ length: 6 }).map((_, i) => {
                  const char = otp[i] || '';
                  const isCurrent = otp.length === i && isFocused;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.otpBox,
                        isCurrent && styles.otpBoxActive,
                      ]}
                    >
                      <Text style={styles.otpText}>{char}</Text>
                    </View>
                  );
                })}
              </TouchableOpacity>

              <Text style={styles.hintText}>
                Didn't receive it? <Text style={styles.resendText}>Resend OTP</Text>
              </Text>

              <TouchableOpacity
                onPress={() => handleVerify()}
                disabled={loading}
                style={styles.submitButton}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Verify & Continue</Text>
                )}
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
    backgroundColor: '#e70b24',
  },
  headerContent: {
    ...StyleSheet.absoluteFill,
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
    paddingTop: 28,
    paddingBottom: 40,
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
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
  },
  phoneBold: {
    color: '#0f172a',
    fontWeight: '600',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderColor: '#e70b24',
    borderWidth: 2,
  },
  otpText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  hintText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  resendText: {
    color: '#e70b24',
    fontWeight: '500',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#e70b24',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
