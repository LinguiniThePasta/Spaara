import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from "@/styles/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {useSelector} from "react-redux";

export default function Header({header, backButton, backLink, noProfile}) {
    const role = useSelector((state) => state.role.role);

    return (
        <View style={styles.header}>
            <View style={styles.left}>
                {backButton && (
                    <Pressable onPress={() => router.push(backLink)} style={{paddingRight: 10, marginLeft: -10}}>
                        <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText}/>
                    </Pressable>
                )}
                <Text style={styles.headerTitle}>{header}</Text>
            </View>
            {noProfile && (
                <View style={styles.noProfileIconContainer}>
                </View>
            )}
            {!noProfile && role !== 'Guest' && (
                <TouchableOpacity style={styles.profileIconContainer} onPress={() => router.push('/profile')}>
                </TouchableOpacity>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProfileIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
