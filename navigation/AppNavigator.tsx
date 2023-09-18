import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ScreenNavigationProp} from './type';
import LoginScreen from '../screens/LoginScreen';
import StaffScreen from '../screens/StaffScreen';
import AdminScreen from '../screens/AdminScreen';

const stack = createNativeStackNavigator<ScreenNavigationProp>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <stack.Screen
          name="StaffScreen"
          component={StaffScreen}
          options={{
            headerShown: false,
          }}
        />
        <stack.Screen
          name="AdminScreen"
          component={AdminScreen}
          options={{
            headerShown: false,
          }}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
