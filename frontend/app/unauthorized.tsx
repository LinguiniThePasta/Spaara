import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Unauthorized() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={"Access Denied"} backButton={false} />
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>You're not supposed to access this, get an account first!</Text>
                </View>
            </SafeAreaView>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "space-between"
    },
    messageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    messageText: {
        fontSize: 20,
        color: Colors.light.primaryText,
        textAlign: 'center',
    },
});

