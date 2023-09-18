import React from 'react';
import {StyleSheet, Text, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';

const AdminScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return <Text>Admin</Text>;
};

const styles = StyleSheet.create({});

export default AdminScreen;
