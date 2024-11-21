import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    View,
    Alert
} from 'react-native';
import { API_BASE_URL } from '@/scripts/config';
import { router } from 'expo-router';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function ChangeUsername() {
    const [currentUsername, setCurrentUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [confirmNewUsername, setConfirmNewUsername] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const handleChangeUsername = async () => {
        if (isDisabled) return;
        if (newUsername !== confirmNewUsername) {
            Alert.alert('Error', 'New emails do not match');
            return;
        }
        setIsDisabled(true);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/user/update_info`,
                {
                    old_username: currentUsername,
                    username: newUsername,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            Alert.alert('Success', 'Username changed successfully');
            router.push('/profile');
        } catch (error) {
            const errorData = error.response.data;
            const errorMessage = errorData.old_username || errorData.username || errorData.message || 'An error occurred';
            Alert.alert('Error', errorMessage);

        } finally {
            setIsDisabled(false);
        }
    };



    const fetchUserInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/update_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setCurrentUsername(response.data.username);
            console.log("Fetched user info! email: " + response.data.email + "   password: " + response.data.password + "   username: " +  response.data.username);

        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);



    return (
        <SafeAreaView style={styles.container}>
            <Header header="Change Username"
                    backButton={true}
                    backLink={"profile"}
                    noProfile={false}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder={"Current Username: " + currentUsername}
                        placeholderTextColor={Colors.light.secondaryText}
                        //onChangeText={setCurrentUsername}
                        //value={currentUsername}
                        editable={false}
                        //spellCheck={false}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="New Username"
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setNewUsername}
                        value={newUsername}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="Confirm New Username"
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setConfirmNewUsername}
                        value={confirmNewUsername}
                    />
                    <Pressable
                        style={[globalStyles.primaryButton, styles.changeUsernameButton]}
                        onPress={handleChangeUsername}
                        disabled={isDisabled}
                    >
                        <Text style={styles.changeUsernameButtonText}>Change Username</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            <Footer />
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
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        marginBottom: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeUsernameButton: {
        width: '100%',
        marginTop: 20,
    },
    changeUsernameButtonText: {
        ...globalStyles.buttonText,
    },
});