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

export default function ProfileColorsScreen() {
    const [colorList, setColorList] = useState([
        "#ffffff",
        "#000000",
    ]);


    const renderColor = (color) => {
        return (
            <View style={styles.item}>
                <Icon name={"ellipse"} size={40} color={color}/>
            </View>
        );
    };

    const renderRow = (color) => {
        return  (
            <View style={styles.row}>
                {renderColor(color)}
            </View>
        )
    }

    const renderList = () => {
        return (
            <ScrollView style={styles.listContainer}>

            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Set Profile Icon"
                    backButton={true}
                    backLink={"themes"}
                    noProfile={true}
            />

                <View style={styles.content}>
                    <ScrollView style={styles.listContainer}>
                        <View style={styles.row}>
                            {renderColor(colorList[0])}
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                            <View style={styles.item}/>
                        </View>
                    </ScrollView>
                </View>
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
    listContainer: {
        //flexDirection: "row",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    item: {
        height: 50,
        width: 50,
        color: "#ff0000",
        borderColor: "#000000",
        borderWidth: 5,
        borderRadius: 10,
        margin: 10,
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
