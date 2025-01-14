import React from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert} from 'react-native';
//import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector, useDispatch} from "react-redux";

export default function ThemesScreen() {

    const Colors = useSelector((state) => state.colorScheme);
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

    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.container}>
            <Header header="Themes"
                    backButton={true}
                    backLink={"settings"}
                    noProfile={false}
            />

                <View style={styles.content}>
                    <View>
                        <Pressable style={styles.listItem} onPress={() => router.replace('/profileIcons')}>
                            <Text style={styles.optionText}>Change Profile Icon</Text>
                        </Pressable>
                        <Pressable style={styles.listItem} onPress={() => router.replace('/profileColors')}>
                            <Text style={styles.optionText}>Change Profile Color</Text>
                        </Pressable>
                        <Pressable style={styles.listItem} onPress={() => router.replace('/colorSchemes')}>
                            <Text style={styles.optionText}>Change App Theme</Text>
                        </Pressable>
                        <Pressable style={styles.listItem} onPress={() => router.replace('/colorSchemeColor')}>
                            <Text style={styles.optionText}>Change App Colors</Text>
                        </Pressable>
                        {/*
                        <Pressable style={styles.listItem} onPress={() => router.push('/setAddress')}>
                            <Text style={styles.optionText}>Change App Theme</Text>
                        </Pressable>
                        */}
                    </View>
                </View>
        </SafeAreaView>
        <Footer/>
        </View>
    );
}

/*
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
*/
