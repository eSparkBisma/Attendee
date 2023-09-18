import {useHookstate} from '@hookstate/core';
import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, View, useColorScheme} from 'react-native';
import store from '../store/store';
import {Attendance} from '../store/Attendance';
import {useNavigation} from '@react-navigation/native';
import {ScreenNavigationProp} from '../navigation/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StaffScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const staffState = useHookstate(store.staff);
  const attendanceState = useHookstate<Attendance[]>(store.attendance);
  const loggedIn = useHookstate(store.loggedIn);
  const studentID = useHookstate('');
  const navigation = useNavigation<ScreenNavigationProp>();

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('@user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      loggedIn.set(user.staffId);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleAttendancePunch = () => {
    const staffId = loggedIn.value;
    console.log(attendanceState.value);
    const currentDate = new Date().toISOString();
    const existingAttendance = attendanceState.value.findIndex(
      (record: {staffId: number; date: string}) => record.staffId === staffId,
    );

    if (existingAttendance === -1) {
      const newAttendanceRecord: Attendance = {
        staffId: staffId,
        date: currentDate,
        status: 'present',
      };
      attendanceState.merge([newAttendanceRecord]);
      console.log('Attendance punched:', newAttendanceRecord);
    } else {
      console.log('Attendance already punched for today.');
    }
  };

  const handleMarkAttendance = () => {};

  const handleLogout = () => {
    loggedIn.set(0);
    AsyncStorage.removeItem('@user');
    navigation.goBack();
  };

  return (
    <View style={{}}>
      {loggedIn.value ? (
        <>
          <Text>logged in as {loggedIn.value}</Text>
          <Button title="Punch Attendance" onPress={handleAttendancePunch} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Please log in to access this screen.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default StaffScreen;
