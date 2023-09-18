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
  const roleState = useHookstate('staff'); // Default role is 'staff'
  const usernameState = useHookstate('');
  const passwordState = useHookstate('');
  const staffState = useHookstate(store.staff);

  const loggedIn = useHookstate(store.loggedIn);
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('@user');
    if (storedUser) {
      navigation.navigate('StaffScreen');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // const getHeadName = (headId: number) => {
  //   const head = staffState.value.find(staff => staff.staffId === headId);
  //   return head ? head.name : '';
  // };

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
        loggedIn.set(staff.staffId);
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
        loggedIn.set(admin.staffId);
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
