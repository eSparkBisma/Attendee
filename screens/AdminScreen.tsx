import React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import store from '../store/store';
import {useHookstate} from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ScreenNavigationProp} from '../navigation/type';

const AdminScreen: React.FC = () => {
  const students = useHookstate(store.students);
  const staff = useHookstate(store.staff);
  const attendanceState = useHookstate(store.attendance);
  const studentAttendanceState = useHookstate(store.attendanceStudents);

  console.log(studentAttendanceState.value);
  const navigation = useNavigation<ScreenNavigationProp>();
  const userData = useHookstate<{
    headOf?: number;
    name: string;
    password: string;
    staffId: number;
    username: string;
    admin: boolean;
  } | null>(null);

  // Function to get attendance status (present/absent)
  const getAttendanceStatus = (id: number) => {
    const attendanceRecord = attendanceState.value.find((record: any) => {
      return record.staffId === id;
    });
    return attendanceRecord ? 'Present' : 'Absent';
  };
  const getStudentAttendanceStatus = (id: number) => {
    const attendanceRecord = studentAttendanceState.value.find(
      (record: any) => {
        return record.id === id;
      },
    );

    return attendanceRecord ? 'Present' : 'Absent';
  };

  const groupedStudentsByClass: Record<string, any[]> = {};
  students.value.forEach((student: any) => {
    const {class: studentClass} = student;
    if (!groupedStudentsByClass[studentClass]) {
      groupedStudentsByClass[studentClass] = [];
    }
    groupedStudentsByClass[studentClass].push(student);
  });

  const handleLogout = () => {
    AsyncStorage.removeItem('@admin-user');
    userData.set(null);
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Attendance Report</Text>
        <Text style={styles.subHeading}>Staff Attendance:</Text>
        <View>
          {staff.value.map((staffMember: any) => (
            <View key={staffMember.staffId} style={styles.reportItem}>
              <Text>{staffMember.name}:</Text>
              <Text>{getAttendanceStatus(staffMember.staffId)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.subHeading}>Student Attendance:</Text>
        {Object.entries(groupedStudentsByClass).map(
          ([classNumber, classStudents]) => (
            <View key={classNumber}>
              <Text style={styles.classHeading}>Class {classNumber}:</Text>
              {classStudents.map((student: any) => (
                <View key={student.id} style={styles.reportItem}>
                  <Text>{student.name} </Text>
                  <Text>{getStudentAttendanceStatus(student.id)}</Text>
                </View>
              ))}
            </View>
          ),
        )}
      </ScrollView>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  classHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default AdminScreen;
