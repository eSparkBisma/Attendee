import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ScreenNavigatorParamList={
    LoginScreen: undefined;
    StaffScreen: undefined;
    HeadScreen: undefined;

}

export type ScreenNavigationProp = NativeStackScreenProps<ScreenNavigatorParamList,LoginScreen, StaffScreen, HeadScreen>