import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
//import { Colors } from '@/styles/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from "@/components/Footer"; // Assuming you have a Colors file for styling
import Header from "@/components/Header";
import { useSelector } from 'react-redux';

export default function FavoritesScreen() {

    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.light.background,
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
        listContainer: {
            paddingHorizontal: 20,
        },
        favoriteItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: Colors.light.secondaryText,
        },
        favoriteItemTitle: {
            fontSize: 18,
            color: Colors.light.primaryText,
        },
        iconContainer: {
            flexDirection: 'row',
        },
        icon: {
            marginLeft: 10,
        },
    });

    const favorites = [
        { id: '1', title: 'Cumin Seeds' },
        { id: '2', title: 'Bananas' },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.favoriteItem}>
            <Text style={styles.favoriteItemTitle}>{item.title}</Text>
            <View style={styles.iconContainer}>
                {/* Star Icon */}
                <Pressable onPress={() => console.log(`Star pressed for ${item.title}`)}>
                    <Icon name="star-outline" size={20} color={Colors.light.primaryText} style={styles.icon} />
                </Pressable>

                {/* Trash Icon */}
                <Pressable onPress={() => console.log(`Delete pressed for ${item.title}`)}>
                    <Icon name="trash-outline" size={20} color={Colors.light.primaryText} style={styles.icon} />
                </Pressable>

                {/* Plus Icon */}
                <Pressable onPress={() => console.log(`Add pressed for ${item.title}`)}>
                    <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.icon} />
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.container}>
            <Header header="Favorites" backButton={false} backLink={"profile"} noProfile={false} />

            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            
        </SafeAreaView>
        {/* Footer */}
        <Footer />
        </View>
    );
}

/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
    listContainer: {
        paddingHorizontal: 20,
    },
    favoriteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
    },
    favoriteItemTitle: {
        fontSize: 18,
        color: Colors.light.primaryText,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
});
*/