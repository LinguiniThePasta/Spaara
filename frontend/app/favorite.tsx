import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/styles/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from "@/components/Footer"; // Assuming you have a Colors file for styling
import {FavoriteItem} from '@/components/Item'

export default function FavoritesScreen() {
    const [favoriteItems, setFavoriteItems] = useState([
        { id: '1', title: 'Cumin Seeds' },
        { id: '2', title: 'Bananas' },
    ]);


    const renderFavoriteItem = ({item}) => (
        <FavoriteItem item={item} addFavoriteItem={setFavoriteItems} removeFromFavorite={setFavoriteItems}></FavoriteItem>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={styles.profileIconContainer}>
                    <View style={styles.profileIcon} />
                </View>
            </View>

            <FlatList
                data={favoriteItems}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id.toString()}
                style={styles.flatList}
            />

            {/* Footer */}
            <Footer />
        </SafeAreaView>
    );
}

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
    flatList: {
        marginLeft: 10,
    },
});
