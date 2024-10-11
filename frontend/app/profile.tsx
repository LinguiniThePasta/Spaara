import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, Alert} from "react-native";
import React, {useState} from "react";
import {Stack, useRouter, Link} from 'expo-router';
import Button from '@/components/Button';
import TabsFooter from '@/components/TabsFooter';
import * as Location from "expo-location";
import axios from "axios";
import {API_BASE_URL} from "@/components/config";
import {isAuthenticated} from "@/components/Axios";
import * as SecureStore from "expo-secure-store";

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");


//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function ProfileScreen() {
    //const pushLogin = () => router.push("/login")
    const pushLogin = () => alert("Sign in");
    const [emailText, onEmailChangeText] = React.useState('');
    const [usernameText, onUsernameChangeText] = React.useState('');
    const [passwordText, onPasswordChangeText] = React.useState('');
    const [confirmPWText, onConfirmPWChangeText] = React.useState('');
    const [searchRadius, setSearchRadius] = React.useState(0);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);

    const handleSetHome = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied.');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
    }

    const confirmChanges = async () => {
        try {
            var data = {};
            if (emailText) {
                data.email = emailText;
            }
            if (usernameText) {
                data.username = usernameText;
            }
            if (passwordText) {
                data.password = passwordText;
            }
            if (searchRadius) {
                data.radius = searchRadius;
            }
            if (latitude) {
                data.latitude = latitude;
            }
            if (longitude) {
                data.longitude = longitude;
            }
            const response = await axios.post(`${API_BASE_URL}/api/user/update_info`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                },
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Your changes have been saved successfully!');
            } else {
                Alert.alert('Error', 'There was a problem saving your changes.');
            }
        } catch (error) {
            console.log('Error confirming changes:', error);
            Alert.alert('Error', 'An error occurred while saving your changes. Please try again.');
        }
    };

    return (
        <View style={profileStyles.container}>

            <View style={profileStyles.headerContainer}>
                {/*<NavigationButton label="Back" type="back" destination="/welcome"/>*/}
                <View style={profileStyles.headerSpacer}/>
                <Text style={profileStyles.headerLabel}>Settings</Text>
                <View style={profileStyles.headerSpacer}/>
            </View>

            <View style={profileStyles.contentContainer}>
                <TextInput
                    style={profileStyles.textInputField}
                    onChangeText={onEmailChangeText}
                    value={emailText}
                    placeholder="Update Email"
                    placeholderTextColor='#959595'
                />
                <TextInput
                    style={profileStyles.textInputField}
                    onChangeText={onUsernameChangeText}
                    value={usernameText}
                    placeholder="Update Username"
                    placeholderTextColor='#959595'
                />
                <TextInput
                    style={profileStyles.textInputField}
                    onChangeText={onPasswordChangeText}
                    value={passwordText}
                    placeholder="Update Password"
                    placeholderTextColor='#959595'
                />
                <TextInput
                    style={profileStyles.textInputField}
                    onChangeText={onConfirmPWChangeText}
                    value={confirmPWText}
                    placeholder="Confirm Password"
                    placeholderTextColor='#959595'
                />
                <TextInput
                    style={profileStyles.textInputField}
                    onChangeText={setSearchRadius}
                    value={searchRadius}
                    placeholder="Set Search Radius"
                    placeholderTextColor='#959595'
                />
                <View style={profileStyles.signupButtonsContainer}>
                    <Button label="Set Home Location" theme="primary-wide" onPress={handleSetHome}/>
                </View>
                <View style={profileStyles.signupButtonsContainer}>
                    <Button label="Confirm Changes" theme="primary-wide" onPress={confirmChanges}/>
                </View>
            </View>

            <TabsFooter/>

            <StatusBar style='auto'/>
        </View>
    );
}


const profileStyles = StyleSheet.create({

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

    signupButtonsContainer: {
        alignItems: 'center',
        marginTop: 40,
        //marginBottom: 20,
    },

});
