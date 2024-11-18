import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from "@/styles/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {useSelector} from "react-redux";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed



export default function Header({header, backButton, backLink, noProfile}) {
    const role = useSelector((state) => state.role.role);

    const [selectedIcon, setSelectedIcon] = useState("");
    const [selectedColor, setSelectedColor] = useState(Colors.light.background);

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/profile_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setSelectedIcon(response.data.icon);
            setSelectedColor(response.data.color);
            console.log("Fetched profile info! color: " + response.data.color + "   icon: " + response.data.icon);
        } catch (error) {
            console.error('Error fetching profile info:', error);
        }
    };



    return (
        <View style={styles.header}>
            <View style={styles.left}>
            {backButton && (
                backLink !== "prev" ? (
                    <Pressable onPress={() => router.push(backLink)} style={{ paddingRight: 10, marginLeft: -10 }}>
                        <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText} />
                    </Pressable>
                ) : (
                    <Pressable onPress={() => router.back()} style={{ paddingRight: 10, marginLeft: -10 }}>
                        <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText} />
                    </Pressable>
                )
            )}
                <Text style={styles.headerTitle}>{header}</Text>
            </View>
            {noProfile && (
                <View style={styles.noProfileIconContainer}>
                </View>
            )}
            {!noProfile && role !== 'Guest' && (
                <View style={{borderColor: selectedColor, borderRadius: 100, borderWidth: 2}}>
                    <TouchableOpacity style={styles.profileIconContainer} onPress={() => router.push('/profile')}>
                        <Icon name={selectedIcon} size={30} color={selectedColor}/>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        color: Colors.light.primaryText,
    },
    left: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: Colors.light.primaryText,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
    },
    profileIconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProfileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: "rgba(0, 0, 0, 0)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: Colors.light.secondaryText,
    },
});
