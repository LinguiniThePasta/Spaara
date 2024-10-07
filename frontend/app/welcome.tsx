import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
const router = useRouter();
//router.navigate("/login");





/*export default function Index() {
  return (
    <NavigationContainer>
      <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary"/>
            <Button label="Sign up" theme="primary"/>
          </View>
          <View style={styles.logInButtonsRow}>
            <Button label="or continue as Guest" theme="secondary"/>
          </View>
        </View>

        <StatusBar style="auto"/>
      </View>
    </NavigationContainer>
  );
}*/





/*export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{title: "Welcome"}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogInScreen}
          options={{title: "Log in"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/



//const pushLogin = () => router.push("/login")
const pushLogin = () => alert("I wanna push!!!!");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary" onPress={pushLogin}/>
            <Button label="Sign up" theme="primary" onPress={pushLogin}/>
          </View>
          <View style={styles.logInButtonsRow}>
            <Button label="or continue as Guest" theme="secondary" onPress={pushLogin}/>
          </View>
        </View>

        <StatusBar style='auto'/>
      </View>
  );
}





/*
function LogInScreen() {
  return (
    <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary"/>
          </View>
        </View>

        <StatusBar style="auto"/>
      </View>
  );
}
*/





const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
  },

  logoImageContainer: {
    paddingVertical: 110,
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
