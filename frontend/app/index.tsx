import React from 'react';
import {View, Text, Pressable, Image, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {Link, router} from 'expo-router';
import {useFonts} from 'expo-font';
import {globalStyles} from '../styles/globalStyles';
import {Colors} from "@/styles/Colors";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config";
import {setRole} from "@/store/roleSlice";
import {useDispatch} from "react-redux";

const {width, height} = Dimensions.get('window');

export default function WelcomeScreen() {
    const [fontsLoaded] = useFonts({
        'Lato-Regular': require('../assets/fonts/Lato/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato/Lato-Bold.ttf'),
    });
    const dispatch = useDispatch();


    const guestLogin = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/login`, {
                    "guest": 'True',
                },
                {
                    headers: {
                        'Content-Type': `application/json`
                    }
                }
            );
            await SecureStore.setItemAsync('jwtToken', response.data.access);
            await SecureStore.setItemAsync('refreshToken', response.data.refresh);
            await SecureStore.setItemAsync('username', response.data.username);

            dispatch(setRole("Guest"));
            router.push("/shopping")
        } catch (error) {
            console.error('Error fetching user settings:', error);

        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.logoContainer}>
                    <Image source={require('@/assets/images/SpaaraLogo.png')} style={styles.logo}/>
                </View>
            </SafeAreaView>
            <View style={styles.bottomPage}>
                <View style={styles.buttonContainer}>
                    <Pressable style={globalStyles.primaryGreyButton}>
                        <Text style={globalStyles.buttonText}>Continue with Google</Text>
                    </Pressable>
                    <Pressable style={globalStyles.primaryGreyButton} onPress={() => {
                        router.push("/signup")
                    }}>
                        <Text style={globalStyles.buttonText}>Continue with Email</Text>
                    </Pressable>
                    <Pressable style={globalStyles.secondaryGreyButton} onPress={guestLogin}>
                        <Text style={globalStyles.buttonText}>Continue as Guest</Text>
                    </Pressable>
                    <Pressable style={globalStyles.secondaryGreyButton} onPress={() => {
                        router.push("/login")
                    }}>
                        <Text style={globalStyles.buttonText}>Login</Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.13,
    },
    logo: {
        width: width * 0.8,
        height: height * 0.1,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Lato-Regular',
    },
    bottomPage: {
        width: '100%',
        height: height * 0.4,
        alignItems: 'center',
        backgroundColor: Colors.light.primaryText,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingVertical: height * 0.03
    },
    buttonContainer: {
        width: 0.85 * width,
    }
});