import React from 'react';
import store from '../store/store';
import {useHookstate} from '@hookstate/core';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AttendanceStudents} from '../store/AttendanceStudents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentsList: React.FC<{classNumber: number}> = ({classNumber}) => {
  const students = useHookstate(store.students);
  const attendanceState = useHookstate<AttendanceStudents[]>(
    store.attendanceStudents,
  );
  const filteredStudents = students.value.filter(
    student => student.class === classNumber,
  );

  const handleMarkAttendance = (studentId: number) => {
    const existingAttendance = attendanceState.value.findIndex(
      (record: {id: number}) => record.id === studentId,
    );

    if (existingAttendance === -1) {
      const newAttendanceRecord = {
        id: studentId,
        status: 'present',
      };
      attendanceState.merge([newAttendanceRecord]);

      console.log(`Attendance marked for Student ${studentId}`);
    } else {
      console.log(`Attendance already marked for Student ${studentId} today.`);
    }
  };

  const handleBulkAttendanceMarking = async () => {
    try {
      const bulkAttendance = filteredStudents.map(student => ({
        id: student.id,
        status: 'present',
      }));
      attendanceState.merge(bulkAttendance);
      console.log('Bulk Attendance marked for Class', classNumber);
    } catch (error) {
      console.error('Error saving bulk attendance:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Class {classNumber} Students:</Text>
      {filteredStudents.map(student => (
        <View key={student.id} style={styles.studentContainer}>
          <Text>
            Name: {student.name} Id: {student.id}
          </Text>
          <Button
            title="Present"
            onPress={() => handleMarkAttendance(student.id)}
          />
        </View>
      ))}
      <Button
        title="Mark Bulk Attendance"
        onPress={handleBulkAttendanceMarking}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

export default StudentsList;
