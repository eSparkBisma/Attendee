import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
