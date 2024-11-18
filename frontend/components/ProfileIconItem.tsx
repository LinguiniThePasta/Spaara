import React from 'react';
import { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert, ScrollView} from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileIconItem({icon, iconColor, handleIconSelected}) {
    //console.log("icon name: " + icon.name + "   selected: " + icon.selected);
    if (icon.selected) {
        return(
            <View>
                <Pressable style={styles.selectedItem} onPress={() => handleIconSelected(icon)}>
                    <Icon name={icon.name} size={40} color={iconColor}/>
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            <Pressable style={styles.item} onPress={() => handleIconSelected(icon)}>
                <Icon name={icon.name} size={40} color={iconColor}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'space-between',
    },
    listContainer: {
    },
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    selectedItem: {
        height: 70,
        width: 70,
        borderColor: "#009900",
        borderWidth: 3,
        borderRadius: 100,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        height: 70,
        width: 70,
        borderColor: Colors.light.background,
        borderWidth: 3,
        borderRadius: 100,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    dummyItem: {
        height: 70,
        width: 70,
        margin: 10,
    },
});
