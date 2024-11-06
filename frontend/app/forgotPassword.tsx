import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, SafeAreaView, Dimensions, Pressable} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {Stack, useRouter, Link, Href, router, useFocusEffect} from 'expo-router';
import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from "@/scripts/config";
import {Colors} from "@/styles/Colors";
import {globalStyles} from "@/styles/globalStyles";
import parseErrors from "@/scripts/parseErrors";

const {width, height} = Dimensions.get('window');

export default function forgotPassword() {

    return(
        <SafeAreaView style={styles.container}>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },

})