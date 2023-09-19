import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useHookstate} from '@hookstate/core';
import store from '../store/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {ScreenNavigationProp} from '../navigation/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const roleState = useHookstate('staff');
  const usernameState = useHookstate('');
  const passwordState = useHookstate('');
  const staffState = useHookstate(store.staff);
  const userData = useHookstate<{
    staffId: number;
    name: string;
    username: string;
    password: string;
    headOf?: number;
  } | null>(null);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('@user');
      const adminData = await AsyncStorage.getItem('@admin-user');
      if (data) {
        userData.set(JSON.parse(data));
        navigation.navigate('StaffScreen');
      } else if (adminData) {
        userData.set(JSON.parse(adminData));
        navigation.navigate('AdminScreen');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogin = () => {
    const role = roleState.value;
    const username = usernameState.value;
    const password = passwordState.value;
    if (role === 'staff') {
      const staff = staffState.value.find(
        staff => staff.username === username && staff.password === password,
      );
      if (staff) {
        AsyncStorage.setItem('@user', JSON.stringify(staff));
        console.log('Staff logged in:', staff);
        userData.set({
          headOf: staff?.headOf,
          name: staff.name,
          password: staff.password,
          staffId: staff.staffId,
          username: staff.username,
        });
        console.log(userData);
        navigation.navigate('StaffScreen');
      } else {
        console.log('Staff login failed');
      }
    } else if (role === 'admin') {
      const admin = staffState.value.find(
        admin =>
          admin.username === username &&
          admin.password === password &&
          admin.admin === true,
      );
      if (admin) {
        console.log('Admin logged in:', admin);
        AsyncStorage.setItem('@admin-user', JSON.stringify(admin));
        userData.set({
          name: admin.name,
          password: admin.password,
          staffId: admin.staffId,
          username: admin.username,
        });
        navigation.navigate('AdminScreen');
      } else {
        console.log('Admin login failed');
      }
    } else {
      console.log('Please select a role');
    }
  };

  return (
    <View style={{flex: 1, marginHorizontal: '5%', marginTop: '10%'}}>
      <Text style={styles.heading}>Login as</Text>

      <RadioButton.Group
        onValueChange={value => roleState.set(value)}
        value={roleState.value}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <RadioButton.Item label="Staff" value="staff" />
          <RadioButton.Item label="Admin" value="admin" />
        </View>
      </RadioButton.Group>

      <TextInput
        placeholder="Username"
        onChangeText={text => usernameState.set(text)}
        value={usernameState.value}
      />
      <TextInput
        placeholder="Password"
        onChangeText={text => passwordState.set(text)}
        value={passwordState.value}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: '7%',
  },
});

export default LoginScreen;
