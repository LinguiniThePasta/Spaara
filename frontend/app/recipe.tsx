import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config";
import * as SecureStore from 'expo-secure-store';
import shortenTime from "@/scripts/shortenTime";


export default function Recipe() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        getRecipes();
    }, []);
    const getRecipes = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/api/recipe/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("jwtToken")}`
                },
            }
        );
        const formattedRecipes = response.data.map((item) => ({
            id: item.id,
            name: item.name,
            time: shortenTime(item.update_time)
        }));
        setRecipes(formattedRecipes);
    }
    const deleteRecipe = async (item) => {
        const id = item.id;
        const response = await axios.delete(
            `${API_BASE_URL}/api/recipe/${id}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("jwtToken")}`
                },
            }
        );
        await getRecipes();
    }


    const renderItem = ({item}) => (
        <View style={styles.listItem}>
            <Pressable style={styles.listItemLeft}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemDate}>{item.time}</Text>
            </Pressable>
            <Pressable onPress={() => {deleteRecipe(item); console.log("Deleted") } }>
                <Icon name="trash-outline" size={24} color={Colors.light.primaryText}/>
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
                    data={recipes}
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
