import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function HomePage() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search for item"
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Shop Buttons */}
                <View style={styles.shopContainer}>
                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>Shop 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>Shop 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>Shop 3</Text>
                    </TouchableOpacity>
                </View>

                {/* Reminder Section */}
                <View style={styles.reminderContainer}>
                    <Text style={styles.reminderText}>Don't forget to Buy!</Text>
                </View>

                {/* Large Section (Placeholder for more content) */}
                <View style={styles.largeSection} />

                {/* Favorite Stores Section */}
                <View style={styles.favStoresContainer}>
                    <Text style={styles.favStoresText}>Favorited Stores</Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.footerItem}>
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Text style={styles.footerText}>Shopping List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Text style={styles.footerText}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Text style={styles.footerText}>Recipes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    searchContainer: {
        marginVertical: 16,
        alignItems: 'center',
    },
    searchBar: {
        width: '90%',
        height: 40,
        backgroundColor: '#d3d3d3',
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    shopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    shopButton: {
        backgroundColor: '#b0b0b0',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    shopButtonText: {
        color: '#000',
        fontSize: 16,
    },
    reminderContainer: {
        backgroundColor: '#e0e0e0',
        padding: 16,
        marginVertical: 10,
        borderRadius: 10,
    },
    reminderText: {
        fontSize: 16,
        color: '#000',
    },
    largeSection: {
        backgroundColor: '#d3d3d3',
        height: 150,
        borderRadius: 10,
        marginVertical: 10,
    },
    favStoresContainer: {
        backgroundColor: '#e0e0e0',
        padding: 16,
        marginVertical: 10,
        borderRadius: 10,
    },
    favStoresText: {
        fontSize: 16,
        color: '#000',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#000',
    },
});
