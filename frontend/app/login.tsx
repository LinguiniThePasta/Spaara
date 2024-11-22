import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, SafeAreaView, Dimensions, Pressable} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {Stack, useRouter, Link, Href, router, useFocusEffect} from 'expo-router';
import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from "@/scripts/config";
import {Colors} from "@/styles/Colors";
import {globalStyles} from "@/styles/globalStyles";
import parseErrors from "@/scripts/parseErrors";
import {setRole} from "@/store/roleSlice";
import {useDispatch} from "react-redux";
import { setBackground, setColorScheme, setPrimaryColor } from "@/store/colorScheme";

const {width, height} = Dimensions.get('window');

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

export default function Login() {
    const [username, onUsernameChange] = React.useState('');
    const [password, onPasswordChange] = React.useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const dispatch = useDispatch();

    const [selectedBackground, setSelectedBackground] = useState("lightMode");
    const [selectedPrimaryColor, setSelectedPrimaryColor] = useState("lightMode");

    const fetchThemeInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/theme_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setSelectedBackground(response.data.background);
            setSelectedPrimaryColor(response.data.primaryColor);
            console.log("Fetched Background: " + selectedBackground);
            console.log("Fetched Primary Color: " + selectedPrimaryColor);
            dispatch(setBackground(selectedBackground));
            dispatch(setPrimaryColor(selectedPrimaryColor));
            /*
            const newThemeList = themeList.map((currentTheme) => ({
                ...currentTheme,
                selected: (currentTheme.name === response.data.background),
            }));
            setThemeList(newThemeList);
            */
            console.log("Fetched theme info! background: " + response.data.background + "   primaryColor: " + response.data.primaryColor);

        } catch (error) {
            console.error('Error fetching theme info:', error);
        }
    };

    const handleLogin = async () => {
        if (isDisabled) return;
        setIsDisabled(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/login`,
                {
                    "email": username,
                    "password": password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("Reaches")
            await SecureStore.setItemAsync('jwtToken', response.data.access);
            await SecureStore.setItemAsync('refreshToken', response.data.refresh);

            dispatch(setRole("User"));

            await fetchThemeInfo();
            //dispatch(setColorScheme(Colors[]))
            console.log(selectedBackground);
            console.log(selectedPrimaryColor);
            dispatch(setBackground(selectedBackground));
            dispatch(setPrimaryColor(selectedPrimaryColor));

            router.replace('/shopping');
        } catch (error) {
            console.log(error);
            // Check if error.response and error.response.data exist before calling parseErrors
            if (error.response && error.response.data) {
                alert(parseErrors(error.response.data));
            } else {
                alert('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsDisabled(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const logout = async () => {
                try {
                    await SecureStore.deleteItemAsync('jwtToken');
                    console.log('JWT token cleared on reaching login screen.');
                } catch (error) {
                    console.log('Error clearing JWT token:', error);
                }
            };

            logout();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Pressable style={styles.backButton} onPress={() => {
                    router.replace("/splash")
                }}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </Pressable>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Welcome back!</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Email"
                            placeholderTextColor={Colors.light.secondaryText}
                            onChangeText={onUsernameChange}
                            value={username}
                        />
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor={Colors.light.secondaryText}
                            onChangeText={onPasswordChange}
                            value={password}
                        />
                        <View style={styles.forgotPasswordWrapper}>
                            <Pressable style={styles.forgotPasswordContainer} onPress={() => 
                                router.replace('/forgotPassword')
                            }>
                                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                            </Pressable>
                        </View>
                        <Pressable style={[globalStyles.primaryButton, styles.loginButton]} onPress={() => {
                            handleLogin();
                        }}>
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </Pressable>
                    </View>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Pressable onPress={() => {
                            router.replace("/signup")
                        }} style={styles.signupLink}>
                            <Text style={styles.signupLinkText}>Sign Up.</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: Colors.light.primaryText,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 0.85 * width,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
        marginBottom: 0.04 * height,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: "center",
    },
    input: {
        marginBottom: 0.02 * height,
        width: '100%',
    },
    forgotPasswordWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        height: 28,
    },
    forgotPasswordContainer: {},
    forgotPasswordText: {
        ...globalStyles.primaryText,
        color: Colors.light.primaryColor,
        fontSize: 12,
    },
    loginButton: {
        width: '100%',
        marginTop: 0.06 * height,
    },
    loginButtonText: {
        ...globalStyles.buttonText,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        ...globalStyles.primaryText,
    },
    signupLink: {
        marginLeft: 5,
    },
    signupLinkText: {
        ...globalStyles.primaryText,
        color: Colors.light.primaryColor,
    },
});
