import {Stack} from "expo-router";
import {setStatusBarTranslucent} from "expo-status-bar";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import '../components/Axios';
import {Provider} from "react-redux";
import store from "@/store/store";
import {TransitionPresets} from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
    DefaultTransition,
    ModalPresentationIOS
} from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets";

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

    const getScreenOptions = (fromRoute, toRoute) => {
        // Custom animation logic based on source and destination
        if (fromRoute === "favorites" && toRoute === "map") {
            return {...TransitionPresets.SlideFromRightIOS}; // Slide from right
        } else if (fromRoute === "map" && toRoute === "favorites") {
            return {...TransitionPresets.ModalPresentationIOS}; // Slide from right
        }
        else {
            return {animation: 'default'}; // Default animation
        }
    };

    return (
        <Provider store={store}>
            <Stack screenOptions={{
                headerShown: false,
                animation: 'none',
                freezeOnBlur: true,
                // gestureEnabled: false, // Disable swipe-back gesture
            }}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="login"/>
                <Stack.Screen name="signup"/>
                <Stack.Screen name="welcome"/>
                <Stack.Screen name="splash"/>
                <Stack.Screen name="shopping"/>
                <Stack.Screen name="profile"/>
                <Stack.Screen name="map"/>
                <Stack.Screen name="settings"/>
                <Stack.Screen name="unauthorized"/>
                <Stack.Screen name="savedLists"/>
                <Stack.Screen name="filterScreen"/>
                <Stack.Screen name="savedRecipes"/>
                <Stack.Screen name="social"/>
                <Stack.Screen name="forgotPassword"/>
                <Stack.Screen name="recoverPassword"/>
            </Stack>
        </Provider>
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
