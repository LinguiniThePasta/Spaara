import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import MapView from 'react-native-maps';

export default function App() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
        <Footer />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    map: {
        flex: 1,  // This allows MapView to take up the available space above the footer
    },
    footer: {
        height: 60, // Set a height for the footer
    },
});