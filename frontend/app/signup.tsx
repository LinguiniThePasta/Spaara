import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, SafeAreaView, Dimensions, Pressable} from "react-native";
import React, {useCallback, useEffect} from "react";
import {Stack, useRouter, Link, Href, router, useFocusEffect} from 'expo-router';
import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from "@/components/config";
import {Colors} from "@/styles/Colors";
import {globalStyles} from "@/styles/globalStyles";

const {width, height} = Dimensions.get('window');

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

export default function Signup() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Pressable style={styles.backButton} onPress={() => {
                    router.push("/splash")
                }}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </Pressable>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Create your account</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Email"
                            placeholderTextColor={Colors.light.secondaryText}
                        />
                        <TextInput
                            style={[globalStyles.primaryInput, styles.input]}
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor={Colors.light.secondaryText}
                        />
                        {/* Placeholder to compensate for the removed Forgot Password text */}
                        <View style={styles.placeholder} />

                        <Pressable style={[globalStyles.primaryButton, styles.signupButton]}>
                            <Text style={styles.signupButtonText}>Sign up</Text>
                        </Pressable>
                    </View>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Pressable onPress={() => {
                            router.push("/login")
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
