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

export default function ProfileColorItem({iconColor, handleColorSelected}) {
    //console.log("color name: " + iconColor.name + "   selected: " + iconColor.selected);
    if (iconColor.selected) {
        return(
            <View>
                <Pressable style={styles.selectedItem} onPress={() => handleColorSelected(iconColor)}>
                    <Icon name={"ellipse"} size={40} color={iconColor.name}/>
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            <Pressable style={styles.item} onPress={() => handleColorSelected(iconColor)}>
                <Icon name={"ellipse"} size={40} color={iconColor.name}/>
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
