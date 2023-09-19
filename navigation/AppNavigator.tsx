import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ScreenNavigationProp} from './type';
import LoginScreen from '../screens/LoginScreen';
import StaffScreen from '../screens/StaffScreen';
import AdminScreen from '../screens/AdminScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useHookstate} from '@hookstate/core';

const stack = createNativeStackNavigator<ScreenNavigationProp>();

const AppNavigator = () => {
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
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

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
