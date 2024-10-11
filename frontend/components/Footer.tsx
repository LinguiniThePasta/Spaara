import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {router} from "expo-router";

export default function Footer() {
    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem} onPress={()=> router.push("/shopping")}>
                <Text style={styles.footerText}>Shopping List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Recipes</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Evenly distributes the items
        alignItems: 'center',
        backgroundColor: '#d3d3d3', // Light grey background color to match your image
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ccc', // Slight border to separate footer from the rest of the content
    },
    footerItem: {
        flex: 1,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#000', // Black text color
    },
});