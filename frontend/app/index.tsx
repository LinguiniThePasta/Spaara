import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image} from "react-native";
//import { Stack } from 'expo-router';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


import Button from '@/components/Button';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

const Stack = createNativeStackNavigator();


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

function WelcomeScreen() {
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
                    <Button label="Sign up" theme="primary"/>
                </View>
                <View style={styles.logInButtonsRow}>
                    <Button label="or continue as Guest" theme="secondary"/>
                </View>
            </View>

            <StatusBar style='auto'/>
        </View>
    );
}


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


import React from 'react';
import {SafeAreaView, Platform, KeyboardAvoidingView, useWindowDimensions} from 'react-native';
import {useEditorBridge, CoreBridge, TaskListBridge, HistoryBridge} from '@10play/tentap-editor';
import {RichText, Toolbar} from '@10play/tentap-editor';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function TenTap() {
    // Setting up the editor with taskList+ restriction
    const editor = useEditorBridge({
        bridgeExtensions: [
            CoreBridge.extendExtension({content: 'taskList+'}), // Enforce task list as default
            TaskListBridge,  // To allow task list items
            HistoryBridge,   // To enable undo/redo functionality
        ],
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: `<p>This is a basic example of a task list!</p>`,
    });

    const {top} = useSafeAreaInsets();
    const {width, height} = useWindowDimensions();
    const isLandscape = width > height;
    const headerHeight = isLandscape ? 32 : 44;
    const keyboardVerticalOffset = headerHeight + top;

    return (
        <SafeAreaView style={styles.fullScreen}>
            {/* Main editor where users can add tasks */}
            <RichText editor={editor}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                {/* Undo/Redo toolbar */}
                <Toolbar editor={editor}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

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
    fullScreen: {
        flex: 1,
    },
    keyboardAvoidingView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
});
