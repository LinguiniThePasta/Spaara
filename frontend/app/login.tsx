


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function LogInScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
  return (
    <View style={loginStyles.container}>

        <View style={loginStyles.headerContainer}>
          <Text style={loginStyles.headerLabel}>Log in</Text>
        </View>

        <View style={loginStyles.contentContainer}>
          <Button label="Log in with Google" theme="secondary" onPress={pushLogin}/>
          <Button label="Username" theme="primary" onPress={pushLogin}/>
          <Button label="Password" theme="primary" onPress={pushLogin}/>
          <Button label="Log in" theme="primary" onPress={pushLogin}/>
        </View>

        <StatusBar style='auto'/>
      </View>
  );
}



const loginStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
  },

  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: '#F6AA1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerLabel: {
    marginTop: 50,
    marginBottom: 10,
    color: '#232528',
    fontSize: 28,
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 110,
  },

});
