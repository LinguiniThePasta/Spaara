import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Assuming you have a Colors file for styling
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
export default function MapScreen() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={"Map"} backButton={false} backLink={""}/>
                <View>
                    {/*<MapView style={styles.map} provider={PROVIDER_GOOGLE}/>*/}
                </View>

                {/*<View style={styles.informationBox}>*/}
                {/*    <Text style={styles.informationText}>Information</Text>*/}
                {/*</View>*/}

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
        height: '100%'
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
