import { Stack } from "expo-router";
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
/*
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
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
}
*/



// Import gesture handler root view
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, View, StyleSheet, Text} from 'react-native';
import {ThemeProvider, theme} from "react-native-design-system";
import React from "react";
import "react-native-get-random-values";
import {TodoList} from "@/app/TodoList";

export default function RootLayout({children}) {
    return (
        <GestureHandlerRootView style={styles.container}>
            <ThemeProvider theme={theme}>
                <TodoList/>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});


