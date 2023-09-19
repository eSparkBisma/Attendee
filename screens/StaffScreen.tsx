import {useHookstate} from '@hookstate/core';
import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import store from '../store/store';
import {Attendance} from '../store/Attendance';
import {useNavigation} from '@react-navigation/native';
import {ScreenNavigationProp} from '../navigation/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentsList from '../components/ListStudents';

const StaffScreen: React.FC = () => {
  const attendanceState = useHookstate<Attendance[]>(store.attendance);
  const navigation = useNavigation<ScreenNavigationProp>();
  const userData = useHookstate<{
    headOf?: number;
    name: string;
    password: string;
    staffId: number;
    username: string;
  } | null>(null);

  //data--->string and userData--->JSON object
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('@user');
      if (data) {
        userData.set(JSON.parse(data));
        console.log(userData);
      }
      const storedAttendance = await AsyncStorage.getItem('@attendance');
      if (storedAttendance) {
        const parsedAttendance = JSON.parse(storedAttendance);
        attendanceState.set(parsedAttendance);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleAttendancePunch = async () => {
    const staffId = userData.value?.staffId;
    console.log(attendanceState.value);
    const existingAttendance = attendanceState.value.findIndex(
      (record: {staffId: number | undefined}) => record.staffId === staffId,
    );

    if (existingAttendance === -1) {
      const newAttendanceRecord: Attendance = {
        staffId: staffId,
        status: 'present',
      };
      attendanceState.merge([newAttendanceRecord]);

      try {
        const storedAttendance = await AsyncStorage.getItem('@attendance');
        let parsedAttendance = storedAttendance
          ? JSON.parse(storedAttendance)
          : [];
        parsedAttendance.push(newAttendanceRecord);
        await AsyncStorage.setItem(
          '@attendance',
          JSON.stringify(parsedAttendance),
        );
        console.log('Attendance punched:', newAttendanceRecord);
      } catch (error) {
        console.error('Error saving attendance:', error);
      }
    } else {
      console.log('Attendance already punched for today.');
    }
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('@user');
    userData.set(null);
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={{}}>
      {userData.value ? (
        <>
          <Text style={{textAlign: 'center', padding: '3%'}}>
            logged in as {userData.value.name}
          </Text>
          <Button title="Punch Attendance" onPress={handleAttendancePunch} />

          {userData.value.headOf ? (
            userData.value.headOf === 9 ? (
              <StudentsList classNumber={9} />
            ) : (
              <StudentsList classNumber={10} />
            )
          ) : null}

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
