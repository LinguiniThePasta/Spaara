import React, {useState} from 'react';
import {View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header"; // Use your color definitions

export default function ShoppingListScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const shoppingLists = [
        {id: '1', title: "My Shopping List 1", date: "10/10/24"},
        {id: '2', title: "My Shopping List 2", date: "10/10/24"},
        {id: '3', title: "Lingyu’s Shopping List", date: "10/10/24"},
    ];

    const renderItem = ({item}) => (
        <View style={styles.listItem}>
            <View style={styles.listItemLeft}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemDate}>{item.date}</Text>
            </View>
            <Pressable onPress={() => console.log(`Delete ${item.title}`)}>
                <Icon name="trash-outline" size={24} color={Colors.light.secondaryText}/>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={"Shopping Lists"}/>
                <View style={globalStyles.searchBar}>
                    <Icon name="search-outline" size={20} color={Colors.light.primaryColor} style={styles.searchIcon}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={Colors.light.secondaryText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={shoppingLists}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            </SafeAreaView>
            <Footer/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },

    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.primaryText,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
    },
    listItemLeft: {
        flexDirection: 'column',
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
    },
    listItemDate: {
        fontSize: 14,
        color: Colors.light.secondaryText,
    },
});
