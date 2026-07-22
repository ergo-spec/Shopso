import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  StaffWorkspace: NavigatorScreenParams<StaffStackParamList>;
};

export type AuthStackParamList = {
  MobileLogin: undefined;
  OtpVerification: { phone: string };
};

export type StaffStackParamList = {
  StaffTabs: NavigatorScreenParams<StaffTabParamList>;
  PendingDsr: undefined;
  CreateEntry: { category: string; subType: string };
};

export type StaffTabParamList = {
  Entry: undefined;
  Attendance: undefined;
  AddEntryAction: undefined;
  History: undefined;
  Account: undefined;
};
