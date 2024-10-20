import React, {useState} from 'react';
import {View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header"; // Use your color definitions

export default function RecipeListScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const shoppingLists = [
        {id: '1', title: "My Recipe 1", date: "10/10/24"},
        {id: '2', title: "My Recipe 2", date: "10/10/24"},
        {id: '3', title: "Lingyu’s Recipe", date: "10/10/24"},
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
                <Header header={"Recipes"}/>


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
