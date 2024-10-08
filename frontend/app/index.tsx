


import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');
const spaaraIconImage = require('@/assets/images/SpaaraIcon.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





/*export default function Index() {
  const router = useRouter();
  router.push("/welcome");
}
*/





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function WelcomeScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("Continue as Guest");
  return (
    <View style={welcomeStyles.container}>

        <View style={welcomeStyles.logoImageContainer}>
          <Image
            style={welcomeStyles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={welcomeStyles.logInButtonsContainer}>
          <View style={welcomeStyles.logInButtonsRow}>
            <NavigationButton label="Log in" type="push" destination="/login"/>
            <NavigationButton label="Sign up" type="push" destination="/signup"/>
          </View>
          <View style={welcomeStyles.logInButtonsRow}>
            <NavigationButton label="or continue as Guest" type="push" destination="/shopping"/>
          </View>
        </View>

        <StatusBar style='auto'/>
      </View>
  );
}



const welcomeStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
  },

  logoImageContainer: {
    paddingTop: 220,
    paddingBottom: 110,
  },

  logoImage: {
    width: 300,
    height: 84,
  },

  logInButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  logInButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

function LogInScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
  const [usernameText, onUsernameChangeText] = React.useState('');
  const [passwordText, onPasswordChangeText] = React.useState('');
  return (
    <View style={loginStyles.container}>

        <View style={loginStyles.headerContainer}>
          <Text style={loginStyles.headerLabel}>Log in</Text>
        </View>

        <View style={loginStyles.contentContainer}>
          <Button label="Log in with Google" theme="secondary" onPress={pushLogin}/>
          <TextInput
            style={loginStyles.textInputField}
            onChangeText={onUsernameChangeText}
            value={usernameText}
            placeholder="Username / Email"
          />
          <TextInput
            style={loginStyles.textInputField}
            onChangeText={onPasswordChangeText}
            value={passwordText}
            placeholder="Password"
          />
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

  textInputField: {
    height: 20,
    width: 325,
    margin: 25,
    padding: 2,
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#959595',
    color: '#232528',
  },

});





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

function SignUpScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
  const [emailText, onEmailChangeText] = React.useState('');
  const [usernameText, onUsernameChangeText] = React.useState('');
  const [passwordText, onPasswordChangeText] = React.useState('');
  const [confirmPWText, onConfirmPWChangeText] = React.useState('');
  return (
    <View style={signUpStyles.container}>

        <View style={signUpStyles.headerContainer}>
          <Text style={signUpStyles.headerLabel}>Sign up</Text>
        </View>

        <View style={signUpStyles.contentContainer}>
          <Button label="Sign up with Google" theme="secondary" onPress={pushLogin}/>
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
          {/*<Button label="Email" theme="primary" onPress={pushLogin}/>
          <Button label="Username" theme="primary" onPress={pushLogin}/>
          <Button label="Password" theme="primary" onPress={pushLogin}/>
          <Button label="Confirm Password" theme="primary" onPress={pushLogin}/>
          */}
          <Button label="Sign up" theme="primary" onPress={pushLogin}/>
          <NavigationButton label="Go Away!" type="push" destination="/login"/>
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

  textInputField: {
    height: 20,
    width: 325,
    margin: 25,
    padding: 2,
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#959595',
    color: '#232528',
  },

});





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

function SplashScreen() {
  //const router = useRouter();
  return (
    <View style={splashStyles.container}>
        <Image style={splashStyles.iconImage} source={spaaraIconImage}/>
        <StatusBar style='auto'/>
      </View>
  );
}




const splashStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconImage: {
    width: 150,
    height: 107,
  },

});
