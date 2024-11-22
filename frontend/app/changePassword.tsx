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
import Icon from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '@/scripts/config';
import { router } from 'expo-router';
//import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';

export default function ChangePassword() {

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
        changePasswordButton: {
            width: '100%',
            marginTop: 20,
            backgroundColor: Colors.light.primaryColor,
        },
        changePasswordButtonText: {
            ...globalStyles.buttonText,
            color: Colors.light.background,
        },
    });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const handleChangePassword = async () => {
        if (isDisabled) return;
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        setIsDisabled(true);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/user/update_info`,
                {
                    old_password: currentPassword,
                    password: newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            Alert.alert('Success', 'Password changed successfully');
            router.replace('/profile');
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                Alert.alert('Error', error.response.data.message || 'An error occurred');
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Change Password"
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
                        placeholder="Current Password"
                        secureTextEntry
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setCurrentPassword}
                        value={currentPassword}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="New Password"
                        secureTextEntry
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setNewPassword}
                        value={newPassword}
                    />
                    <TextInput
                        style={[globalStyles.primaryInput, styles.input]}
                        placeholder="Confirm New Password"
                        secureTextEntry
                        placeholderTextColor={Colors.light.secondaryText}
                        onChangeText={setConfirmNewPassword}
                        value={confirmNewPassword}
                    />
                    <Pressable
                        style={[globalStyles.primaryButton, styles.changePasswordButton]}
                        onPress={handleChangePassword}
                        disabled={isDisabled}
                    >
                        <Text style={styles.changePasswordButtonText}>Change Password</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            <Footer />
        </SafeAreaView>
    );
}

