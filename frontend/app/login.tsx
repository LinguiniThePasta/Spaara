import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput} from "react-native";
import React from "react";
import {Stack, useRouter, Link, Href, router} from 'expo-router';
import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");


//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function LogInScreen() {
    //const pushLogin = () => router.push("/login")
    const pushLogin = () => alert("Log in");
    const [username, onUsernameChange] = React.useState('');
    const [password, onPasswordChange] = React.useState('');
    const handleLogin = async () => {
        try {
            const response = await axios.post(
                //TODO: CHANGE THIS TO YOUR PC'S IP ADDRESS
                'http://192.168.4.68:8000/api/user/login',
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

            await SecureStore.setItemAsync('jwtToken', response.data.access);
            await SecureStore.setItemAsync('refreshToken', response.data.refresh);
            router.push('/home');
        } catch (error) {
            console.log(error);
            alert('Invalid credentials');
        }
    };

    return (
        <View style={loginStyles.container}>
            <View style={loginStyles.headerContainer}>
                <NavigationButton label="Back" type="back" destination="/welcome"/>
                <Text style={loginStyles.headerLabel}>Log in</Text>
                <View style={loginStyles.headerSpacer}/>
            </View>

            <View style={loginStyles.contentContainer}>
                <Button label="Log in with Google" theme="google" onPress={pushLogin}/>
                <View style={loginStyles.separatorContainer}>
                    <View style={loginStyles.separatorSpacer}/>
                    <Text style={loginStyles.separatorLabel}>OR</Text>
                    <View style={loginStyles.separatorSpacer}/>
                </View>
                <TextInput
                    style={loginStyles.textInputField}
                    onChangeText={onUsernameChange}
                    value={username}
                    placeholder="Username / Email"
                />
                <TextInput
                    style={loginStyles.textInputField}
                    onChangeText={onPasswordChange}
                    value={password}
                    placeholder="Password"
                />
                <View style={loginStyles.loginButtonsContainer}>
                    <Button label="Log in" theme="primary-wide" onPress={handleLogin}/>
                </View>
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
        justifyContent: 'space-between',
    },

    headerLabel: {
        width: 290,
        marginTop: 50,
        marginBottom: 10,
        color: '#232528',
        fontSize: 28,
        textAlign: 'center',
    },

    headerSpacer: {
        width: 50,
        height: 50,
        marginTop: 50,
        marginBottom: 10,
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30,
    },

    separatorContainer: {
        flexDirection: 'row',
        width: 325,
        height: 25,
        marginTop: 25,
        marginBottom: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    separatorLabel: {
        width: 41,
        height: 20,
        color: '#959595',
        fontSize: 15,
        textAlign: 'center'
    },

    separatorSpacer: {
        width: 142,
        height: 1,
        marginVertical: 12,
        backgroundColor: '#959595',
        borderRadius: 100,
    },

    textInputField: {
        height: 20,
        width: 325,
        margin: 25,
        fontSize: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#959595',
        color: '#232528',
    },

    loginButtonsContainer: {
        alignItems: 'center',
        marginTop: 50,
    },

});
