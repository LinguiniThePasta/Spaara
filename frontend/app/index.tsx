


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');
const spaaraIconImage = require('@/assets/images/SpaaraIcon.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

function WelcomeScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
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
            <Button label="Log in" theme="primary" onPress={pushLogin}/>
            <Button label="Sign up" theme="primary" onPress={pushLogin}/>
          </View>
          <View style={welcomeStyles.logInButtonsRow}>
            <Button label="or continue as Guest" theme="secondary" onPress={pushLogin}/>
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





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

function SignUpScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
  return (
    <View style={signUpStyles.container}>

        <View style={signUpStyles.headerContainer}>
          <Text style={signUpStyles.headerLabel}>Sign up</Text>
        </View>

        <View style={signUpStyles.contentContainer}>
          <Button label="Sign up with Google" theme="secondary" onPress={pushLogin}/>
          <Button label="Email" theme="primary" onPress={pushLogin}/>
          <Button label="Username" theme="primary" onPress={pushLogin}/>
          <Button label="Password" theme="primary" onPress={pushLogin}/>
          <Button label="Confirm Password" theme="primary" onPress={pushLogin}/>
          <Button label="Sign up" theme="primary" onPress={pushLogin}/>
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

});





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function SplashScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("I wanna push!!!!");
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