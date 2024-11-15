import React from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert} from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector} from "react-redux";

export default function SettingScreen() {

    const role = useSelector((state) => state.role.role);

    const handleDelete = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken")
            const response = axios.delete(
                `${API_BASE_URL}/api/user/delete`,
                {
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                }
            );
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert(`Error deleting account:, ${error}`);
        }

        alert("Account Deleted Successfully!");
        router.push("/login");
    }

    const deleteConfirmation = () => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this list? Deleted lists cannot be restored.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {text: "Delete", onPress: () => handleDelete()}
            ],
            {cancelable: false}
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Settings"
                    backButton={true}
                    backLink={"profile"}
                    noProfile={true}
            />

            {role === "User" && (
                <View style={styles.content}>
                    <View>
                        <Pressable style={styles.listItem} onPress={() => router.push('/filterScreen')}>
                            <Text style={styles.optionText}>Configure Filters</Text>
                        </Pressable>
                        <Pressable style={styles.listItem} onPress={() => router.push('/themes')}>
                            <Text style={styles.optionText}>Themes</Text>
                        </Pressable>
                        <Pressable style={styles.listItem} onPress={() => router.push('/setAddress')}>
                            <Text style={styles.optionText}>Set Address</Text>
                        </Pressable>
                    </View>

                    <Pressable style={[styles.listItem, {marginBottom: 20}]} onPress={deleteConfirmation}>
                        <Text style={[styles.optionText, {color: "red"}]}>Delete Account</Text>
                    </Pressable>
                </View>
            )}
            <Footer/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: "space-between"
    },
    optionText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.primaryText,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
        position: 'relative',
    },
});
