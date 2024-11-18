import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet} from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import {useSelector} from "react-redux"; // Use router for navigation if needed
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';

export default function ProfileScreen() {
    const role = useSelector((state) => state.role.role);

    const [username, setUsername] = useState("");

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/update_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setUsername(response.data.username);
            console.log("Fetched user info! email: " + response.data.email + "   password: " + response.data.password + "   username: " +  response.data.username);

        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };



    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.container}>
            <Header header={username}
                    backButton={false}
                    backLink={""}
                    noProfile={false}
            />
            {role === "User" && (
                <View style={styles.content}>
                    <View>
                        <Pressable style={styles.listItem} onPress={() => router.push('/changeUsername')}>
                            <Text style={styles.optionText}>Change username</Text>
                        </Pressable>

                        <Pressable style={styles.listItem} onPress={() => router.push('/changeEmail')}>
                            <Text style={styles.optionText}>Change email</Text>
                        </Pressable>

                        <Pressable style={styles.listItem} onPress={() => router.push('/changePassword')}>
                            <Text style={styles.optionText}>Change password</Text>
                        </Pressable>

                        <Pressable style={styles.listItem} onPress={() => router.push('/settings')}>
                            <Text style={styles.optionText}>Settings</Text>
                        </Pressable>
                    </View>


                    <Pressable style={[styles.listItem, {marginBottom: 20}]} onPress={() => router.push('/login')}>
                        <Text style={[styles.optionText, {color: "red"}]}>Logout</Text>
                    </Pressable>
                </View>
            )}

            
        </SafeAreaView>
        <Footer/>
        </View>
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
        fontFamily: 'Lato-Bold',
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
