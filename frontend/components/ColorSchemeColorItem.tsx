import React from 'react';
import { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert, ScrollView} from 'react-native';
import {Colors, ColorThemes} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';

export default function ColorSchemesItem({colorTheme, isBackground, handleThemeSelected}) {
    //console.log("color name: " + iconColor.name + "   selected: " + iconColor.selected);
    const style = (isBackground) ? styles(ColorThemes[colorTheme.name].background) : styles(ColorThemes[colorTheme.name].primaryColor);

    if (colorTheme.selected) {
        return(
            <View>
                <Pressable style={style.selectedItem} onPress={() => handleThemeSelected(colorTheme)}>
                    {/*<Icon name={"ellipse"} size={40} color={Colors[colorTheme.name].primaryColor}/>*/}
                    <View style={style.leftColor}/>
                    {/*<View style={style.rigthColor}/>*/}
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            <Pressable style={style.item} onPress={() => handleThemeSelected(colorTheme)}>
                {/*<Icon name={"ellipse"} size={40} color={Colors[colorTheme.name].primaryColor}/>*/}
                <View style={style.leftColor}/>
                {/*<View style={style.rigthColor}/>*/}
            </Pressable>
        </View>
    );
}

const styles = (color) => StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: Colors.light.background,
        backgroundColor: color,
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
        flexDirection: "row",
    },
    item: {
        height: 70,
        width: 70,
        //borderColor: Colors.light.background,
        //borderColor: background,
        //borderWidth: 3,
        borderRadius: 100,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    leftColor: {
        height: 50,
        width: 50,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 3,
        borderRadius: 100,
        //borderTopLeftRadius: 100,
        //borderBottomLeftRadius: 100,
        //borderTopRightRadius: 0,
        //borderBottomRightRadius: 0,
    },/*
    rigthColor: {
        height: 50,
        width: 25,
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderWidth: 3,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
    },*/
    dummyItem: {
        height: 70,
        width: 70,
        margin: 10,
    },
});
