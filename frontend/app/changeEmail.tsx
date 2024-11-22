import React, { useState } from 'react';
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
//import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';

export default function ChangeEmail() {

    const Colors = useSelector((state) => state.colorScheme);
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
            borderColor: Colors.light.primaryColor,
            color: Colors.light.primaryText,
        },
        changeEmailButton: {
            width: '100%',
            marginTop: 20,
            backgroundColor: Colors.light.primaryColor,
        },
        changeEmailButtonText: {
            ...globalStyles.buttonText,
            color: Colors.light.background,
        },
    });

    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmNewEmail, setConfirmNewEmail] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const handleChangeEmail = async () => {
        if (isDisabled) return;
        if (newEmail !== confirmNewEmail) {
            Alert.alert('Error', 'New emails do not match');
            return;
        }
        setIsDisabled(true);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/user/update_info`,
                {
                    old_email: currentEmail,
                    email: newEmail,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            Alert.alert('Success', 'Email changed successfully');
            router.replace('/profile');
        } catch (error) {
            const errorData = error.response.data;
            const errorMessage = errorData.old_email || errorData.email || errorData.message || 'An error occurred';
            Alert.alert('Error', errorMessage);

        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Change Email"
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
                        placeholder="Current Email"
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setCurrentEmail}
                        value={currentEmail}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="New Email"
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setNewEmail}
                        value={newEmail}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="Confirm New Email"
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setConfirmNewEmail}
                        value={confirmNewEmail}
                    />
                    <Pressable
                        style={[globalStyles.primaryButton, styles.changeEmailButton]}
                        onPress={handleChangeEmail}
                        disabled={isDisabled}
                    >
                        <Text style={styles.changeEmailButtonText}>Change Email</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            <Footer />
        </SafeAreaView>
    );
}

