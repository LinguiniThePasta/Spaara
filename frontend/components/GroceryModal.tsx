import React, {useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {API_BASE_URL} from "@/scripts/config";
import axios from "axios";
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "@/styles/Colors";
import exp from "node:constants";


const GroceryModel = ({
                         modalVisible,
                         setModalVisible,
                         fetchShoppingList,
                         local
                     }) => {


    const styles = StyleSheet.create({

        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: '50%',
        },

        closeButton: {
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 20,
            color: 'black',
        },
        modalButton: {
            backgroundColor: '#FF6347',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        modalButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        favoriteRecipeContainer: {
            flexDirection: 'row',
            width: "100%",
            alignItems: 'stretch',
        },
        favoriteRecipeButton: {
            flex: 1,
            borderRadius: 50,
            padding: 10,
            alignItems: 'center',
            marginRight: 20,
            marginLeft: 10,
            marginTop: 20,
        },
        selectedButton: {
            backgroundColor: Colors.light.primaryColor,
            padding: 10
        },
        unselectedButton: {
            backgroundColor: Colors.light.background,
            borderColor: Colors.light.primaryColor,
            borderWidth: 2,
            padding: 8
        },
        selectedText: {
            fontSize: 16,
            color: Colors.light.primaryText,
        },
        favoriteHeaderText: {
            fontSize: 28,
            color: Colors.light.primaryText,
            marginLeft: 10,
            marginTop: 15,
        },
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: Colors.light.secondaryText,
        },
        itemTitle: {
            fontSize: 18,
        },
        flatList: {
            marginLeft: 10,
        },


    });
    const [selectedButton, setSelectedButton] = useState('Recipe');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await loadData();
            setData(result);
        };
        fetchData();
    }, [selectedButton, modalVisible]);

    const fetchFavoriteItems = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await fetch(`${API_BASE_URL}/api/favorited/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            const data = await response.json();
            // Parse the API response
            return data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                store: item.store,
                price: parseFloat(item.price),
                user: item.user,
            }));
        } catch (error) {
            console.error("Error fetching favorite items:", error);
            return [];
        }
    };

    // Helper function to fetch recipe items from the API
    const fetchRecipeItems = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await fetch(`${API_BASE_URL}/api/recipe/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            const data = await response.json();
            // Parse the API response
            return data.map((recipe) => ({
                id: recipe.id,
                name: recipe.name,
                creationTime: new Date(recipe.creation_time),
                updateTime: new Date(recipe.update_time),
                user: recipe.user,
            }));
        } catch (error) {
            console.error("Error fetching recipe items:", error);
            return [];
        }
    };

    // Function to load data dynamically based on selected tab
    const loadData = async () => {
        if (selectedButton === 'Favorite') {
            return await fetchFavoriteItems();
        } else if (selectedButton === 'Recipe') {
            return await fetchRecipeItems();
        }
        return [];
    };


    const renderFavoriteItem = ({item}) => {
        const handleAddToList = async () => {
            try {
                const jwtToken = await SecureStore.getItemAsync('jwtToken');
                const endpoint =
                    selectedButton === 'Favorite'
                        ? `${API_BASE_URL}/api/favorited/${item.id}/add_to_shopping_list/`
                        : `${API_BASE_URL}/api/grocery/${local.id}/add_recipe/`;

                const payload =
                    selectedButton === 'Favorite'
                        ? {list: local.id}
                        : {recipe_id: item.id};

                const response = await axios.post(endpoint, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });

                // Axios automatically parses JSON, so use response.data directly
                console.log('Item added successfully:', response.data);
            } catch (error) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error('Failed to add item:', error.response.data);
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error('No response from server:', error.request);
                } else {
                    // Something else caused the error
                    console.error('Error adding item to the list:', error.message);
                }
            } finally {
                fetchShoppingList();
            }
        };

        return (
            <Pressable style={styles.itemContainer} onPress={handleAddToList}>
                <Text style={styles.itemTitle}>{item.name}</Text>
            </Pressable>
        );
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icon name="close-outline" size={40} color={Colors.light.primaryText}/>
                    </Pressable>

                    {/* Favorite and Recipe Buttons */}
                    <View style={styles.favoriteRecipeContainer}>
                        <Pressable
                            style={[
                                styles.favoriteRecipeButton,
                                selectedButton === 'Recipe' && styles.unselectedButton,
                                selectedButton === 'Favorite' && styles.selectedButton
                            ]}
                            onPress={() => setSelectedButton('Favorite')}
                        >
                            <Text style={styles.selectedText}>Favorite</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.favoriteRecipeButton,
                                selectedButton === 'Recipe' && styles.selectedButton,
                                selectedButton === 'Favorite' && styles.unselectedButton
                            ]}
                            onPress={() => setSelectedButton('Recipe')}
                        >
                            <Text style={styles.selectedText}>Recipe</Text>
                        </Pressable>
                    </View>

                    {/* Header Text */}
                    {selectedButton === 'Favorite' && (
                        <Text style={styles.favoriteHeaderText}>Add Favorites</Text>
                    )}
                    {selectedButton === 'Recipe' && (
                        <Text style={styles.favoriteHeaderText}>Add Recipes</Text>
                    )}

                    {/* Favorite/Recipe List */}
                    <FlatList
                        data={data}
                        renderItem={renderFavoriteItem}
                        keyExtractor={(item) => item.id}
                        style={styles.flatList}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default GroceryModel;