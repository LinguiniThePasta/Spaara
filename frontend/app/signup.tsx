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

const {width, height} = Dimensions.get('window');

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

export default function Signup() {
    const [isDisabled, setIsDisabled] = useState(false);
    const handleSignUp = async () => {
        if (isDisabled) return;
        setIsDisabled(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/register`,
                {
                    "username": username,
                    "email": email,
                    "password": password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            router.replace('/login');
        } catch (error) { 
            if (error.response && error.response.data) {
                console.log(error);
                alert(parseErrors(error.response.data));
            } else {
                console.error(error);
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsDisabled(false);
        }
    };
    const [username, onUsernameChange] = React.useState('');
    const [email, onEmailChange] = React.useState('');
    const [password, onPasswordChange] = React.useState('');
    const [confirmPW, onConfirmPWChange] = React.useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Pressable style={styles.backButton} onPress={() => {
                    router.replace("/splash")
                }}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </Pressable>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Create your account</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Username"
                            onChangeText={onUsernameChange}
                            placeholderTextColor={Colors.light.secondaryText}
                        />
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Email"
                            onChangeText={onEmailChange}
                            placeholderTextColor={Colors.light.secondaryText}
                        />
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={onPasswordChange}
                            placeholderTextColor={Colors.light.secondaryText}
                        />
                        {/* Placeholder to compensate for the removed Forgot Password text */}
                        <View style={styles.placeholder} />

                        <Pressable style={[globalStyles.primaryButton, styles.signupButton]} onPress={handleSignUp}>
                            <Text style={styles.signupButtonText}>Sign up</Text>
                        </Pressable>
                    </View>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Have an account? </Text>
                        <Pressable onPress={() => {
                            router.replace("/login")
                        }} style={styles.loginLink}>
                            <Text style={styles.loginLinkText}>Login.</Text>
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
    placeholder: {
        height: 28,
    },
    signupButton: {
        width: '100%',
        marginTop: 0.06 * height,
    },
    signupButtonText: {
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
    loginLink: {
        marginLeft: 5,
    },
    loginLinkText: {
        ...globalStyles.primaryText,
        color: Colors.light.primaryColor,
    },
});
