<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
=======
import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    FlatList,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Button,
    TouchableWithoutFeedback,
    PanResponder, Keyboard,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
>>>>>>> main
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import DraggableItem from '@/components/DraggableItem';
import {Colors} from '@/styles/Colors';
import {Host} from 'react-native-portalize';
import DraggableGroup from '@/components/DraggableGroup';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import {useRouter, useLocalSearchParams} from 'expo-router';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
<<<<<<< HEAD
import Footer from '@/components/Footer';
=======
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {ItemGroup} from '@/components/ItemGroup';
import {CheckItem, FavoriteItem, InputItem, SpacerItem} from '@/components/Item';
import Recipe from './recipe';
import {getQualifiedRouteComponent} from 'expo-router/build/useScreens';
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist';
import GestureDetector from 'react-native-gesture-handler';
import {setCurrentListJson, setLastAccessedList, setSearchQuery} from "@/store/shoppingListSlice";
//import { setSearchQuery } from '../store/shoppingListSlice';
>>>>>>> main

// Item data
type Item = {
    id: string;
    label: string;
    description: string,
    store: string,
    quantity: number,
    units: number,
    favorited: boolean,
    order: number,
    group?: string;
    isInput?: boolean;
};

type Group = {
    id: string;
    label: string;
    items?: Item[];
};

export default function ModifyShopping() {
    // Create input item, which is appended to the end of every group to allow for expansion
    const inputItem: Item = {
        id: 'input',
        label: 'Add Item',
        description: 'Add Item',
        store: 'Add Store',
        isInput: true,
        quantity: 1,
        units: 1,
        favorited: false,
        order: 0,
    };
    const [shoppingListName, setShoppingListName] = useState("Placeholder Name");
    const local = useLocalSearchParams();
<<<<<<< HEAD
=======
    const [searchTerm, setSearchTerm] = useState('');
    const [shoppingLists, setShoppingLists] = useState([]);
    const [shoppingListName, setShoppingListName] = useState("");
    const [newItem, setNewItem] = useState({id: -1, label: "EYES!", favorited: false, checked: false});
    const [newItemName, setNewItemName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [shoppingItems, setShoppingItems] = useState([
        /*{ id: 998, label: 'Ham', price: 3.99, favorited: false, checked: false },
        { id: 999, label: 'Cheese', price: 4.99, favorited: false, checked: false },
        { id: -1, label: '', price: 0, favorited: false, checked: false },*/
    ]);
    const [favoriteItems, setFavoriteItems] = useState([
        {id: 1, label: 'Milk', favorited: true},
        {id: 2, label: 'Rice', favorited: true},
    ]);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');
>>>>>>> main

    useEffect(() => {
        fetchShoppingList();
    }, []);

    // Flatlist data
    const [items, setItems] = useState<Item[]>([
      {id: '1', label: 'Milk', description: 'Whole Milk', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 0, group: 'B'},
      {id: '2', label: 'Eggs', description: 'Large Eggs', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 1, group: 'B'},
      {id: '3', label: 'Bread', description: 'Whole Wheat Bread', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 2, group: 'A'},
      {id: '4', label: 'Butter', description: 'Unsalted Butter', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 3},
      {id: '5', label: 'Cheese', description: 'Cheddar Cheese', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 4, group: 'A'},
      {id: '6', label: 'Apples', description: 'Red Apples', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 5, group: 'A'},
      {id: '7', label: 'Bananas', description: 'Yellow Bananas', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 6},
      {id: '8', label: 'Oranges', description: 'Navel Oranges', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 7, group: 'A'},
    ]);

<<<<<<< HEAD
    const [groups, setGroups] = useState<Group[]>([
        { id: 'A', label: 'Group A', items: items.filter(item => item.group === 'A') },
        { id: 'B', label: 'Group B', items: items.filter(item => item.group === 'B') },
        { id: 'Ungrouped', label: 'Ungrouped', items: items.filter(item => item.group == null) },
    ]);

    //const [baseItems, setBaseItems] = useState([]);
    /*
=======
    const curActiveList = useSelector((state) => state.shoppingList.currentListJson);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedButton, setSelectedButton] = useState('Favorite');
    const [notSelectedButton, setNotSelectedButton] = useState(false);
    const [contentVisable, setContentVisable] = useState('Favorite');
    let isOptimized = false;

    const [itemGroups, setItemGroups] = useState([
        /*{
            id: "1000",
            label: "Smallga",
            items: [{id: 998, label: 'Ham', price: 3.99, favorited: false, checked: false, quantity: 1},
                {id: 999, label: 'Cheese', price: 4.99, favorited: false, checked: false, quantity: 1},]
        },
        {
            id: "1001",
            title: "Bigitte",
            items: [{id: 998, title: 'Big Ham', price: 3.99, favorited: false, checked: false, quantity: 1},
                {id: 999, title: 'Biggy Cheese', price: 4.99, favorited: false, checked: false, quantity: 1},]
        },
         */
    ]);
    const [allRecipes, setAllRecipes] = useState([]);


    const handlePress = (button) => {
        setSelectedButton(button);
        setContentVisable(button);
    };
    const checkIfListIsOptimized = (subheadings) => {
        // Iterate over subheadings to see if any have optimized items
        return subheadings.some(subheading => subheading.optimized_items && subheading.optimized_items.length > 0);
    };

    const handleRename = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;
            const payload = {
                name: newListName,
            };
            const response = await axios.put(`${API_BASE_URL}/api/grocery/${listId}/`, payload, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });
            // Handle successful response
            console.log('Shopping list renamed:', response.data);
        } catch (error) {
            console.error('Error renaming shopping list:', error);
            // Handle error (e.g., show a notification)
        } finally {
            setIsRenameModalVisible(false);
            setShoppingListName(newListName);
            setNewListName("");
        }
    };

>>>>>>> main
    const fetchShoppingList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;
            const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            // Get the subheadings array
            const {name, subheadings} = response.data;
            setShoppingListName(name);

            isOptimized = checkIfListIsOptimized(subheadings);

            const filteredSubheadings = subheadings.filter(subheading => {
                return subheading.optimized === isOptimized;
            });

            const parsedItemGroups = filteredSubheadings.map((subheading) => {
                let storeName = subheading.name;
                let location = "";

                if (isOptimized && subheading.name.includes(";")) {
                    // Split the subheading name into store name and location
                    [storeName, location] = subheading.name.split(";", 2);
                }

                return {
                    id: subheading.id,
                    title: storeName,
                    location: isOptimized ? location.trim() : null,
                    items: [
                        ...(isOptimized
                            ? subheading.optimized_items.map((item) => ({
                                id: item.id,
                                title: item.name,
                                description: item.description,
                                store: item.store,
                                notes: item.notes,
                                quantity: item.quantity,
                                units: item.units,
                                favorited: item.favorited,
                                order: item.order,
                                price: item.price,
                            }))
                            : subheading.items.map((item) => ({
                                id: item.id,
                                title: item.name,
                                description: item.description,
                                store: item.store,
                                notes: item.notes,
                                quantity: item.quantity,
                                units: item.units,
                                favorited: item.favorited,
                                order: item.order,
                            }))),
                        // Add 'Add Item' only if the subheading name is 'Default' and the list is not optimized
                        ...(subheading.name === "Default" && !isOptimized
                            ? [{
                                id: -1,
                                title: "Add Item",
                                favorited: false,
                                quantity: 0,
                            },
                                {
                                    id: -2,
                                    title: '',
                                    favorited: false,
                                    quantity: 0,
                                },
                                {
                                    id: -3,
                                    title: '',
                                    favorited: false,
                                    quantity: 0,
                                }
                            ]
                            : []),
                        ...(subheading.name === "Unoptimized" && isOptimized
                            ? [{
                                id: -1,
                                title: "Add Item",
                                favorited: false,
                                quantity: 0,
                            },
                                {
                                    id: -2,
                                    title: '',
                                    favorited: false,
                                    quantity: 0,
                                },
                                {
                                    id: -3,
                                    title: '',
                                    favorited: false,
                                    quantity: 0,
                                }
                            ]
                            : [])
                    ],
                };
            });

            console.log("parsedItemGroups");
            //Format list of default items
            var defaultItems = [];
            parsedItemGroups.forEach((group) => {
                if (group.title === 'Default' || group.title === 'Unoptimized') {
                    defaultItems = group.items.map((item) => ({
                        id: item.id,
                        label: item.label,
                        description: item.description,
                        notes: item.notes,
                        store: item.store,
                        quantity: item.quantity,
                        units: item.units,
                        favorited: item.favorited,
                        order: item.order,
                    }));
                }
            });
            defaultItems.sort((a, b) => a.order - b.order);
            const finalItemList = [...parsedItemGroups, ...defaultItems];
            console.log("Parsed item groups:", parsedItemGroups);

            // Update state with parsed ItemGroups
            setItemGroups(finalItemList);

            // Flatten items if you need a flat list for any other purpose
            const allItems = parsedItemGroups.reduce((acc, group) => [...acc, ...group.items], []);
            setShoppingItems(allItems);

        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };
<<<<<<< HEAD
=======

    const fetchRecipes = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/recipe/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            const lists = response.data.map(item => ({
                id: item.id.toString(),
                label: item.name,
            }));

            setAllRecipes(lists);

            /*let listName = "Unnamed List";
            lists.forEach(list => {
                if (list.id === local.id) {
                    listName = list.label;
                }
            });

            console.log("Correctly fetched recipes!");
            //setRecipeName(listName);
             */
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const fetchFavorites = async () => {

        //console.log("Adding this: " + newItemName);
        //if (newItemName === "-1") return;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.get(`${API_BASE_URL}/api/favorited/items/`, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });


            const items = response.data.map(item => ({
                id: item.id.toString(),
                label: item.name,
                price: 0,
                favorited: false,
                checked: false,
                //list: item.list.toString(),
                quantity: 1,
            }));

            setFavoriteItems(items);

            console.log('Correctly fetched favorites!');

            // Refresh the shopping lists after adding a new one
            //fetchShoppingItems();
            //setNewItemName("");
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }

    };


    useEffect(() => {
        fetchProfileInfo();
        fetchRecipes();
        fetchShoppingList();
        fetchFavorites();
        fetchRecipes();
    }, []); // Empty dependency array ensures this runs only on component mount

    const [selectedIcon, setSelectedIcon] = useState("");
    const [selectedColor, setSelectedColor] = useState(Colors.light.background);

    const fetchProfileInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/profile_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setSelectedIcon(response.data.icon);
            setSelectedColor(response.data.color);
        } catch (error) {
            console.error('Error fetching profile info:', error);
        }
    };


    const handleAddItem = async () => {
        console.log("Adding this: " + newItemName);
        if (newItemName === "-1") return;

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;

            const unoptimizedResponse = await axios.post(
                `${API_BASE_URL}/api/grocery_items/unoptimized/`,
                {
                    name: newItemName,
                    quantity: 1,
                    units: "units",
                    list: listId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                }
            );

            console.log('Unoptimized item added:', unoptimizedResponse.data);

            // Check if the list is optimized
            const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            const isOptimized = checkIfListIsOptimized(response.data.subheadings);

            // If optimized, add an optimized item with the same details
            if (isOptimized) {
                const optimizedResponse = await axios.post(
                    `${API_BASE_URL}/api/grocery_items/optimized/`,
                    {
                        name: newItemName,
                        quantity: 1,
                        units: "units",
                        list: listId,
                        price: 0, // Placeholder for price, adjust as needed
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                        }
                    }
                );

                console.log('Optimized item added:', optimizedResponse.data);
            }

            // Clear the input field
            setNewItemName("");
        } catch (error) {
            console.error('Error adding shopping item:', error);
        } finally {
            // Refresh the shopping list
            await fetchShoppingList();
        }
    };

    const handleReorderItems = async (items) => {
        const groceryListId = local.id;
        var itemsOrderList = [];
        items.forEach((item) => {
            if (item.order) {
                //console.log("item.id: " + item.id + "   item.label: " + item.label + "   item.quantity: " + item.quantity + "   item.favorited: " + item.favorited);
                itemsOrderList.push(
                    {
                        item_id: item.id,
                        order: item.order
                    }
                );
            }
        });
        /*
        itemsOrderList.forEach((item) => {
            console.log("item_id: " + item.item_id + "   order: " + item.order)
        });
        */
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery/${groceryListId}/reorder-items/`, {
                items_order: itemsOrderList
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            console.log("Reordered Items successfully!");
        } catch (error) {
            console.error('Error reordering items:', error);
        } finally {
            await fetchShoppingList();
        }
    };


    const handleRemove = async (item) => {
        console.log(`Removing item with ID: ${item.id}`);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            try {
                const unoptimizedResponse = await axios.delete(
                    `${API_BASE_URL}/api/grocery_items/unoptimized/${item.id}/?list=${local.id}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + jwtToken,
                        }
                    }
                );
                console.log("Successfully removed item from unoptimized list:", unoptimizedResponse.data);
            } catch (unoptimizedError) {
                console.warn("Failed to remove from unoptimized. Trying optimized endpoint...");
                try {
                    const optimizedResponse = await axios.delete(
                        `${API_BASE_URL}/api/grocery_items/optimized/${item.id}/?list=${local.id}`,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + jwtToken,
                            }
                        }
                    );
                    console.log("Successfully removed item from optimized list:", optimizedResponse.data);
                } catch (optimizedError) {
                    console.error("Failed to remove from both unoptimized and optimized lists.");
                    throw optimizedError;
                }
            }

            // Refresh the shopping lists after adding a new one
            setNewItemName('');
            await fetchShoppingList();
        } catch (error) {
            console.error('Error removing a shopping item:', error);
        }
    }

    const handleFavorite = async (id) => {
        // Simulate favoriting an item
        setShoppingLists(prevLists =>
            prevLists.map(item =>
                item.id === id ? {...item, favorited: !item.favorited} : item
            )
        );
        setFavoriteItems(prevFavorites =>
            prevFavorites.map(item =>
                item.id === id ? {...item, favorited: !item.favorited} : item
            )
        );
    };


    //const [currentDefaultIndex, setCurrentDefaultIndex] = useState(0);
    const renderItem = ({item, drag, isActive}) => {
        const isDefault = (item.label === "Default");
        const isInput = (item.id === -1);
        const isSpacer = (item.id < -1);
        const isItem = (!item.items);
        //console.log("item rendered! label: " + item.label + "   isItem: "  + isItem + "   isInput: " + isInput);
        console.log("Item passed to CheckItem:", item);
        if (isDefault) {
            return (
                <View/>
            );
        }

        if (isSpacer) {
            return (
                <View>
                    <SpacerItem/>
                </View>
            )
        }

        if (isInput) {
            return (
                <View>
                    <InputItem initialText={newItemName} onChangeText={setNewItemName}
                               handleAddItem={handleAddItem}></InputItem>
                </View>
            );
        }

        if (isItem) {
            return (
                <ScaleDecorator>
                    <TouchableOpacity
                        style={{backgroundColor: isActive ? Colors.light.primaryColor : Colors.light.background}}
                        onLongPress={drag}>
                        <CheckItem item={item}
                                   handleFavoriteItem={handleFavorite}
                                   handleRemoveItem={handleRemove}
                                   handleModifyItem={handleModifyItem}
                        ></CheckItem>
                    </TouchableOpacity>
                </ScaleDecorator>
            );
        }

        return (
            <View>
                <ItemGroup name={item.title} items={item.items} handleFavoriteItem={handleFavorite}
                           handleRemoveItem={handleRemove} onChangeText={setNewItemName}
                           handleAddItem={handleAddItem} handleModifyItem={handleModifyItem}></ItemGroup>
            </View>
        );
    };

    const [dummy, setDummy] = useState([]);
    const handleDragEnd = ({data}) => {
        //setItemGroups(data)
        //setDummy(data);

        data.forEach((item) => {
            if (item.order) {
                console.log("order: " + item.order + "   data index: " + data.indexOf(item) + "   itemGroups index: " + itemGroups.indexOf(item) + "   " + item.label);
            }
        });
        var iterator = 1;
        data.forEach((item) => {
            if (item.order) {
                item.order = iterator++;
            }
        });
        data.forEach((item) => {
            if (item.order) {
                console.log("order: " + item.order + "   data index: " + data.indexOf(item) + "   itemGroups index: " + itemGroups.indexOf(item) + "   " + item.label);
            }
        });

        setItemGroups(data)
        handleReorderItems(data);
    };


    const handleAddRecipe = async (recipe) => {
        try {
            const recipeId = recipe.id;
            console.log(recipeId);
            const groceryListId = local.id;
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/grocery/${groceryListId}/add_recipe/`, {
                    recipe_id: recipeId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Check if the response indicates success and handle accordingly
            if (response.status === 200) {
                console.log("Recipe added successfully:", response.data);
            }
        } catch (error) {
            // Handle error responses
            if (error.response) {
                console.error("Error adding recipe:", error.response.data);
            } else {
                console.error("An unexpected error occurred:", error.message);
            }
        } finally {
            fetchShoppingList();
        }
    };

    const renderFavoriteItem = ({item}) => (
        <FavoriteItem item={item} addFavoriteItem={setFavoriteItems}
                      removeFromFavorite={handleAddFavorite}></FavoriteItem>
    );


    const handleAddFavorite = async (item) => {
        //console.log("Adding this: " + newItemName);
        //if (newItemName === "-1") return;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery_items/unoptimized/`, {
                name: item.label,
                quantity: 1,
                units: "units",
                list: local.id
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            setNewItemName("");
        } catch (error) {
            console.error('Error adding new shopping item:', error);
        } finally {
            await fetchShoppingList();
        }
    };

    const renderRecipe = ({item}) => (
        <View style={styles.recipeContainer}>
            <View style={styles.recipeLeft}>
                <Text style={styles.itemlabel}>{item.label}</Text>
            </View>
            <View style={styles.recipeRight}>
                <Pressable onPress={() => handleAddRecipe(item)}>
                    <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.icon}/>
                </Pressable>
            </View>
        </View>
    );


    // const handleAddRecipe = async (item) => {
    //
    //     console.log("Adding this: " + item.id);
    //     //if (newItemName === "-1") return;
    //     try {
    //         const jwtToken = await SecureStore.getItemAsync('jwtToken');
    //         const response = await axios.post(`${API_BASE_URL}/api/grocery_items/unoptimized/`, {
    //             name: item.id,
    //             quantity: -1,
    //             units: "units",
    //             list: local.id,
    //         }, {
    //             headers: {
    //                 'Authorization': 'Bearer ' + jwtToken,
    //             }
    //         });
    //
    //         // Refresh the shopping lists after adding a new one
    //         setNewItemName('');
    //         fetchShoppingItems();
    //     } catch (error) {
    //         console.error('Error adding new shopping item:', error);
    //     }
    //
    //     console.log("Recipe: " + item.label);
    //
    //     await fetchRecipeItems(item.id);
    //
    //     console.log("Recipe Items: ");
    //     recipeItems.forEach((item) => console.log(" + " + item.label));
    //
    //
    //     const newId = 1000 + itemGroups.length;
    //     let newRecipe = {id: newId, label: item.label, items: recipeItems};
    //
    //     setItemGroups([...itemGroups, newRecipe]);
    //     itemGroups.forEach((item) => console.log(item.label));
    //     await fetchShoppingItems();
    //     itemGroups.forEach((item) => console.log("--" + item.label));
    // };


    /*
    const renderItemGroup = ({item}) => (
        <ItemGroup name={item.name} items={shoppingItems} handleFavoriteItem={handleFavorite}
                   handleRemoveItem={handleRemove} onChangeText={setNewItemName}
                   handleAddItem={handleAddItem}></ItemGroup>
    );
>>>>>>> main
    */

    const fetchShoppingList = async () => {
        try {
          const jwtToken = await SecureStore.getItemAsync('jwtToken');
          const listId = local.id;
      
          const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
      
          // Extract data from the response
          const { name, subheadings } = response.data;
          setShoppingListName(name);
      
          // Parse subheadings into groups
          const parsedItemGroups = subheadings.map((subheading) => ({
            id: `${subheading.id}`, // Ensure ID is a string
            label: subheading.name,
            items: subheading.items.map((item) => ({
              id: `${item.id}`, // Ensure ID is a string
              label: item.name,
              description: item.description || '',
              store: item.store || '',
              quantity: item.quantity || 1,
              units: item.units || 1,
              favorited: item.favorited || false,
              order: item.order || 0,
              group: subheading.name, // Assign group name
              isInput: false, // Mark as a regular item
            })),
          }));
      
          // Add an input item to each group for expansion
          parsedItemGroups.forEach((group) => {
            group.items.push({
              id: `${group.id}-input`, // Unique ID for the input item
              label: 'Add Item',
              description: '',
              store: '',
              quantity: 0,
              units: 1,
              favorited: false,
              order: group.items.length + 1, // Place it at the end
              group: group.label,
              isInput: true, // Mark as input item
            });
          });
      
          // Handle ungrouped items
          const ungroupedItems = parsedItemGroups
            .find((group) => group.label === 'Ungrouped')
            ?.items.filter((item) => !item.isInput) // Exclude input items
            .map((item) => ({
              id: item.id,
              label: item.label,
              description: item.description,
              store: item.store,
              quantity: item.quantity,
              units: item.units,
              favorited: item.favorited,
              order: item.order,
            }))
            .sort((a, b) => a.order - b.order) || [];
      
          // Final combined item list
          const finalItemList = [...parsedItemGroups, { id: 'Ungrouped', label: 'Ungrouped', items: ungroupedItems }];
      
          console.log('Parsed item groups:', parsedItemGroups);
      
          // Update state
          setGroups(finalItemList); // Update grouped items
    
        } catch (error) {
          console.error('Error fetching shopping items:', error);
        }
      };

    const renderGroup = ({ group }: { group: Group }) => {
        return (
            <DraggableGroup key={group.id} header={group.label} items={[...group.items, inputItem]} groupId = {group.id} onRegisterItems={registerItems} onDrop={(position, groupId, index)=>handleDrop(position, groupId, index)} onAdd={(newItem, groupId)=>handleAdd(newItem, groupId)}/>
        );
    };

    const addGroup = () => {
        setGroups([ 
          {
            id: `group-${Date.now()}`,
            label: `New Group`,
            items: [],
          },
          ...groups,
        ]);
      };

    const allItemRefs = useRef([]);

    const registerItems = (groupId, refs) => {
        allItemRefs.current[groupId] = refs; // Store refs by group ID
      };

    const handleOptimizeSubheadings = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;
            const response = await axios.post(`${API_BASE_URL}/api/optimize?id=${listId}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });
            console.log(response.data);
            const {name, subheadings} = response.data;

        } catch (error) {
            console.error('Error optimizing:', error);
        }
    };

    const handleModifyItem = async (item) => {
        console.log("handleModifyItem called with item:", item);
        const jwtToken = await SecureStore.getItemAsync('jwtToken');
        console.log("modifying");

        try {

            const response = await axios.patch(`${API_BASE_URL}/api/grocery_items/unoptimized/${item.id}/`, {
                name: item.name,
                store: item.store,
                description: item.description,
                quantity: item.quantity,
                units: item.units,
                notes: item.notes,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });
            console.log("Unoptimized item patched:", response.data);
        } catch (error) {
            console.log("Unoptimized patch failed, trying optimized:", error);

            try {
                const response = await axios.patch(`${API_BASE_URL}/api/grocery_items/optimized/${item.id}/`, {
                    name: item.name,
                    store: item.store,
                    description: item.description,
                    quantity: item.quantity,
                    units: item.units,
                    notes: item.notes, // Ensure this matches the backend field
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + jwtToken,
                    }
                });
                console.log("Optimized item patched:", response.data);
            } catch (optimizedError) {
                console.error("Could not update item in optimized patch:", optimizedError);
            }
        } finally {
            fetchShoppingList();
        }

    }

    const [searchResults, setSearchResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const fetchStoreItems = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.get(`${API_BASE_URL}/api/suggest_stores?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setSearchResults(response.data);
            setDropdownVisible(true);
        } catch (error) {
            console.error('Error fetching store items:', error.message);
        }
    };

    const handleSearchChange = (text) => {
        setSearchTerm(text);
        fetchStoreItems(text);
    };

    const handleSelectItem = async (item) => {
        console.log('Selected Item:', item);

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;

            const unoptimizedResponse = await axios.post(
                `${API_BASE_URL}/api/grocery_items/unoptimized/`,
                {
                    name: item.name,
                    quantity: 1,
                    price: item.price,
                    units: item.units,
                    store: item.store,
                    description: item.description,
                    list: listId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                }
            );

            console.log('Unoptimized item added:', unoptimizedResponse.data);

            // Check if the list is optimized
            const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            const isOptimized = checkIfListIsOptimized(response.data.subheadings);

            // If optimized, add an optimized item with the same details
            if (isOptimized) {
                const optimizedResponse = await axios.post(
                    `${API_BASE_URL}/api/grocery_items/optimized/`,
                    {
                        name: item.name,
                        quantity: 1,
                        price: item.price,
                        units: item.units,
                        store: item.store,
                        description: item.description,
                        list: listId,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                        }
                    }
                );

                console.log('Optimized item added:', optimizedResponse.data);
            }
            setSearchTerm("");
            setSearchResults([]);
        } catch (error) {
            console.error('Error adding shopping item:', error);
        } finally {
            // Refresh the shopping list
            await fetchShoppingList();
        }


        setDropdownVisible(false);
    };

    const handleOutsidePress = () => {
        if (dropdownVisible) {
            setDropdownVisible(false);
            Keyboard.dismiss(); // Hide the keyboard if visible
        }
    };

    const handleAdd = (newItem) => {
        setGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const targetGroup = updatedGroups.find((g) => g.id === newItem.group);

<<<<<<< HEAD
            if (targetGroup) {
                // Generate a unique id for the new item
                const uniqueId = `item-${Date.now()}`;
                const newItemWithId = { ...newItem, id: uniqueId };
=======
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                {/*HEADER*/}
                <View style={styles.header}>
                    <View style={styles.left}>
                        <Pressable onPress={() => router.replace('/shopping')}
                                   style={{paddingRight: 10, marginLeft: -10}}>
                            <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText}/>
                        </Pressable>
                        <Text style={styles.headerlabel}>{`${shoppingListName}`}</Text>
                        <TouchableOpacity style={{marginLeft: 10}} onPress={() => setIsRenameModalVisible(true)}>
                            <Icon name="pencil-outline" size={24} color={Colors.light.primaryText}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor: selectedColor, borderRadius: 100, borderWidth: 2}}>
                        <TouchableOpacity style={styles.profileIconContainer} onPress={() => router.push('/profile')}>
                            <Icon name={selectedIcon} size={30} color={selectedColor}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.searchContainer}>
                    <View style={globalStyles.searchBar}>
                        <Icon name="search-outline" size={20} color={Colors.light.primaryColor}
                              style={styles.searchIcon}/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={Colors.light.secondaryText}
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                handleSearchChange(text);
                            }}
                        />
                    </View>
                    {dropdownVisible && searchResults.length > 0 || searchTerm.length === 0 ? (
                        <View style={styles.dropdown}>
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleSelectItem(item)}
                                    >
                                        <Text>{item.name}</Text>
                                        <Text>${item.price}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    ) : (
                        <Text style={styles.noItemsMessage}>No matching items!</Text>
                    )}
                </View>
>>>>>>> main

                // Add the new item before the input item
                targetGroup.items.splice(targetGroup.items.length - 1, 0, newItemWithId);
            }

                return updatedGroups;
            });
    };

    const handleDrop = (position, groupId, index) => {
      const refsInAllGroups = allItemRefs.current;
    
      // Variables to track the closest overlapping item
      let closestItem = null;
      let closestGroupId = null;
      let minDistance = Infinity;
    
      // Iterate through all groups and their items
      Object.entries(refsInAllGroups).forEach(([group, refs]) => {
        refs.forEach((ref, idx) => {
          if (ref) {
            ref.measure((x, y, width, height, pageX, pageY) => {
              const centerX = pageX + width / 2;
              const centerY = pageY + height / 2;
              const distance = Math.sqrt(
                Math.pow(position.x - centerX, 2) + Math.pow(position.y - centerY, 2)
              );
    
              if (distance < minDistance) {
                minDistance = distance;
                closestItem = { group, idx };
                closestGroupId = group;
              }
            });
          }
        });
      });
    
      if (closestItem && closestGroupId !== null) {
        setGroups((prevGroups) => {
          const updatedGroups = [...prevGroups];
    
          // Find the source and target groups
          const sourceGroup = updatedGroups.find((g) => g.id === groupId);
          const targetGroup = updatedGroups.find((g) => g.id === closestGroupId);
    
          if (sourceGroup && targetGroup) {
            // Remove the dragged item from the source group
            const [draggedItem] = sourceGroup.items.splice(index, 1);
    
            targetGroup.items.splice(closestItem.idx, 0, draggedItem);
          }
    
          return updatedGroups;
        });
    
        console.log(`Switched items between group ${groupId} and group ${closestGroupId}`);
      } else {
        console.log("No overlapping item found");
      }
    };
    

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Header header={shoppingListName} backButton={true} backLink = "/shopping" noProfile={false}  />
                    <FlatList
                        data={groups}
                        renderItem={({ item }) => renderGroup({ group: item })}
                        keyExtractor={group => group.id}
                        style={styles.groupListContainer}
                    />
                    {/*ADD FAVORITES*/}
                    <TouchableOpacity style={styles.starButton} onPress={() => setModalVisible(true)}>
                        <Icon name="star-outline" size={24} color={Colors.light.primaryText}/>
                    </TouchableOpacity>

<<<<<<< HEAD
                    {/*OPTIMIZE*/}
                    <TouchableOpacity style={styles.optimizeButton}>
                        <Icon
                            name="hammer-outline"
                            size={24}
                            color={Colors.light.primaryText}
                        />
                    </TouchableOpacity>
                    {/*ADD FOLDER*/}
                    <TouchableOpacity style={styles.folderButton} onPress={() => addGroup()}>
                        <Icon
                            name="folder-outline"
                            size={24}
                            color={Colors.light.primaryText}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                <Footer/>
            </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 10,
  },
  groupListContainer: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
  },
  starButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.light.primaryColor, // Tomato color
    borderRadius: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
},
folderButton: {
    position: 'absolute',
    bottom: 30,
    left: "50%",
    transform: [{translateX: -30}],
    backgroundColor: Colors.light.primaryColor, // Tomato color
    borderRadius: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
},
optimizeButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: Colors.light.primaryColor, // Tomato color
    borderRadius: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
},
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#b58df1',
    borderRadius: 20,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemGroupContainer: {
    marginBottom: 20,
  },
  itemGrouplabel: {
    backgroundColor: Colors.light.background,
    color: Colors.light.primaryText,
    fontSize: 24,
   },
=======
                {/*ADD FAVORITES*/}
                <TouchableOpacity style={styles.starButton} onPress={() => setModalVisible(true)}>
                    <Icon name="star-outline" size={24} color={Colors.light.primaryText}/>
                </TouchableOpacity>

                {/*OPTIMIZE*/}
                <TouchableOpacity style={styles.optimizeButton} onPress={() => handleOptimizeSubheadings()}>
                    <Icon
                        name="hammer-outline"
                        size={24}
                        color={Colors.light.primaryText}
                    />
                </TouchableOpacity>

                {/*FAVORITES MENU*/}
                <Modal
                    visible={isRenameModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsRenameModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={dismissModal}>
                        <KeyboardAvoidingView
                            style={styles.nameModalContainer}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={60}
                        >
                            <View style={styles.nameModalContent}>
                                <Text style={styles.nameModallabel}>Rename Shopping List</Text>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="Enter new name"
                                    value={newListName}
                                    onChangeText={setNewListName}
                                />
                                <Button title="Rename" onPress={handleRename}/>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>

            <Footer/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="close-outline" size={40} color={Colors.light.primaryText}/>
                        </Pressable>

                        <View style={styles.favoriteRecipeContainer}>
                            <Pressable
                                style={[
                                    styles.favoriteRecipeButton,
                                    selectedButton === 'Recipe' && styles.unselectedButton,
                                    selectedButton === 'Favorite' && styles.selectedButton
                                ]}
                                onPress={() => handlePress('Favorite')}
                            >
                                <Text style={styles.selectedText}>
                                    Favorite
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.favoriteRecipeButton,
                                    selectedButton === 'Recipe' && styles.selectedButton,
                                    selectedButton === 'Favorite' && styles.unselectedButton
                                ]}
                                onPress={() => handlePress('Recipe')}
                            >
                                <Text style={styles.selectedText}>
                                    Recipe
                                </Text>
                            </Pressable>
                        </View>

                        {selectedButton === 'Favorite' && (
                            <Text style={styles.favoriteHeaderText}>Add Favorites</Text>
                        )}
                        {selectedButton === 'Recipe' && (
                            <Text style={styles.favoriteHeaderText}>Add Recipes</Text>)
                        }
                        {contentVisable === 'Favorite' && (
                            <FlatList
                                data={favoriteItems}
                                renderItem={renderFavoriteItem}
                                keyExtractor={item => item.id.toString()}
                                style={styles.flatList}
                            />
                        )}
                        {contentVisable === 'Recipe' && (
                            <FlatList
                                data={allRecipes}
                                renderItem={renderRecipe}
                                keyExtractor={item => item.id.toString()}
                                style={styles.flatList}
                            />
                        )}

                        {/* Remove text inputs */}

                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    shoppingListContainer: {
        flex: 1,
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
    },
    itemLeftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTextContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    itemlabel: {
        fontSize: 18,
    },
    itemInfoContainer: {
        flexDirection: 'row',
    },
    itemPrice: {
        fontSize: 14,
    },
    itemIconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
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
    listItemlabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
    },
    listItemDate: {
        fontSize: 14,
        color: Colors.light.secondaryText,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.light.secondaryText,
        borderRadius: 5,
        marginBottom: 10,
    },
    starButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: Colors.light.primaryColor, // Tomato color
        borderRadius: 50,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optimizeButton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        backgroundColor: Colors.light.primaryColor, // Tomato color
        borderRadius: 50,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartButtonText: {
        color: Colors.light.background,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '50%',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    modallabel: {
        fontSize: 24,
        top: 5,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    closeButton: {
        color: 'black',
    },
    closeButtonText: {
        fontSize: 40,
        fontWeight: 'bold',
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
        color: Colors.light.background,
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
    flatList: {
        marginLeft: 10,
    },
    checkItemContainer: {
        marginBottom: 10, // Add margin to create space between items
    },
    recipeContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    recipeLeft: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    recipeRight: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        flexDirection: 'row',
    },
    plusButton: {
        borderWidth: 2,
        borderColor: Colors.light.secondaryText,
    },
    // For the custom header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        color: Colors.light.primaryText,
    },
    left: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: Colors.light.primaryText,
    },
    headerlabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
    },
    profileIconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Name change modals
    nameModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    nameModalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    nameModallabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nameInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.light.secondaryText,
        borderRadius: 5,
        marginBottom: 10,
    },
    searchContainer: {
        position: 'relative',
        zIndex: 2,
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        width: 300,
        left: '50%',
        transform: [{translateX: -150}],
        backgroundColor: 'white',
        borderColor: Colors.light.primaryColor,
        borderWidth: 1,
        borderRadius: 4,
        maxHeight: 150,
        zIndex: 2,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.primaryColor,
    },
    noItemsMessage: {
        textAlign: 'center',
        color: Colors.light.secondaryText,
        padding: 10,
        fontSize: 16,
    },
>>>>>>> main
});