import { Stack } from "expo-router";
import { setStatusBarTranslucent } from "expo-status-bar";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import '../components/Axios';

export default function RootLayout() {
  const [loaded] = useFonts({
    LeagueSpartan: require('../assets/fonts/LeagueSpartan-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="welcome"/>
      <Stack.Screen name="splash"/>
      <Stack.Screen name="shopping"/>
      <Stack.Screen name="profile"/>
      <Stack.Screen name="map"/>
      <Stack.Screen name="home"/>
    </Stack>
  );
  /*return (
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
  );*/
}
