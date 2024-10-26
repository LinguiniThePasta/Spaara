import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Assuming you have a Colors file for styling
import Mapbox, {MapView} from "@rnmapbox/maps";
import {MAP_API_URL} from "@/scripts/config";

export default function MapScreen() {
    Mapbox.setAccessToken(MAP_API_URL);
    useEffect(() => {
        Mapbox.setTelemetryEnabled(false);
    }, []);
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={"Map"}/>
                <View>
                    <MapView style={styles.map}/>
                </View>

                <View style={styles.informationBox}>
                    <Text style={styles.informationText}>Information</Text>
                </View>

            </SafeAreaView>
            <Footer/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "space-between"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
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
    profileIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: Colors.light.secondaryText,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    informationBox: {
        position: 'absolute',
        bottom: 80,  // Adjust this based on the footer height
        left: 20,
        right: 20,
        padding: 15,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    informationText: {
        fontSize: 18,
        color: Colors.light.primaryText,
    },
});
