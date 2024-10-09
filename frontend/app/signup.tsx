


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React from "react";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function SignUpScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("Sign in");
  const [emailText, onEmailChangeText] = React.useState('');
  const [usernameText, onUsernameChangeText] = React.useState('');
  const [passwordText, onPasswordChangeText] = React.useState('');
  const [confirmPWText, onConfirmPWChangeText] = React.useState('');
  return (
    <View style={signUpStyles.container}>

        <View style={signUpStyles.headerContainer}>
          <NavigationButton label="Back" type="back" destination="/welcome"/>
          <Text style={signUpStyles.headerLabel}>Sign up</Text>
          <View style={signUpStyles.headerSpacer}/>
        </View>

        <View style={signUpStyles.contentContainer}>
          <Button label="Sign up with Google" theme="google" onPress={pushLogin}/>
          <View style={signUpStyles.separatorContainer}>
            <View style={signUpStyles.separatorSpacer}/>
            <Text style={signUpStyles.separatorLabel}>OR</Text>
            <View style={signUpStyles.separatorSpacer}/>
          </View>
          <TextInput
            style={signUpStyles.textInputField}
            onChangeText={onEmailChangeText}
            value={emailText}
            placeholder="Email (Optional)"
            placeholderTextColor='#959595'
          />
          <TextInput
            style={signUpStyles.textInputField}
            onChangeText={onUsernameChangeText}
            value={usernameText}
            placeholder="Username"
            placeholderTextColor='#959595'
          />
          <TextInput
            style={signUpStyles.textInputField}
            onChangeText={onPasswordChangeText}
            value={passwordText}
            placeholder="Password"
            placeholderTextColor='#959595'
          />
          <TextInput
            style={signUpStyles.textInputField}
            onChangeText={onConfirmPWChangeText}
            value={confirmPWText}
            placeholder="Confirm Password"
            placeholderTextColor='#959595'
          />
          <View style={signUpStyles.signupButtonsContainer}>
            <Button label="Sign up" theme="primary-wide" onPress={pushLogin}/>
          </View>
        </View>

        <StatusBar style='auto'/>
      </View>
  );
}



const signUpStyles = StyleSheet.create({

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
    justifyContent: 'space-between',
  },

  headerLabel: {
    width: 290,
    marginTop: 50,
    marginBottom: 10,
    color: '#232528',
    fontSize: 28,
    textAlign: 'center',
  },

  headerSpacer: {
    width: 50,
    height: 50,
    marginTop: 50,
    marginBottom: 10,
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },

  separatorContainer: {
    flexDirection: 'row',
    width: 325,
    height: 25,
    marginTop: 25,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  separatorLabel: {
    width: 41,
    height: 20,
    color: '#959595',
    fontSize: 15,
    textAlign: 'center'
  },

  separatorSpacer: {
    width: 142,
    height: 1,
    marginVertical: 12,
    backgroundColor: '#959595',
    borderRadius: 100,
  },

  textInputField: {
    height: 20,
    width: 325,
    margin: 25,
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#959595',
    color: '#232528',
  },

  signupButtonsContainer: {
    alignItems: 'center',
    marginTop: 50,
  },

});
