import React, {useState, useRef, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GestureDetector, Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '@/components/Header';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import DraggableItem from '@/components/DraggableItem';
//import {Colors} from '@/styles/Colors';
import {Host} from 'react-native-portalize';
import DraggableGroup from '@/components/DraggableGroup';
import {v4 as uuidv4} from 'uuid';
import * as SecureStore from 'expo-secure-store';
import {useRouter, useLocalSearchParams} from 'expo-router';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import Footer from '@/components/Footer';
import {useSelector} from 'react-redux';
import {stringify} from "node:querystring";

// Item data
type Item = {
    id: string;
    name: string;
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

    const Colors = useSelector((state) => state.colorScheme);
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
            //backgroundColor: '#b58df1',
            backgroundColor: Colors.light.background,
            borderRadius: 20,
        },
        groupHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            //color: '#333',
            color: Colors.light.primaryText,
        },
        itemGroupContainer: {
            marginBottom: 20,
        },
        itemGrouplabel: {
            backgroundColor: Colors.light.background,
            color: Colors.light.primaryText,
            fontSize: 24,
        },
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
        modalTitle: {
            fontSize: 24,
            top: 5,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 20, // Increased padding for larger clickable area
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

    // Create input item, which is appended to the end of every group to allow for expansion
    const inputItem: Item = {
        id: 'input',
        name: 'Add Item',
        description: 'Add Item',
        store: 'Add Store',
        isInput: true,
        quantity: 1,
        units: 1,
        favorited: false,
        order: 0,
    };
    const [shoppingListName, setShoppingListName] = useState("Placeholder Name");
    const [modalVisible, setModalVisible] = useState(false);
    const local = useLocalSearchParams();

    useEffect(() => {
        fetchShoppingList();
    }, []);

    // Flatlist data
    const [items, setItems] = useState<Item[]>([
        // {
        //     id: '1',
        //     label: 'Milk',
        //     description: 'Whole Milk',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 0,
        //     group: 'B'
        // },
        // {
        //     id: '2',
        //     label: 'Eggs',
        //     description: 'Large Eggs',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 1,
        //     group: 'B'
        // },
        // {
        //     id: '3',
        //     label: 'Bread',
        //     description: 'Whole Wheat Bread',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 2,
        //     group: 'A'
        // },
        // {
        //     id: '4',
        //     label: 'Butter',
        //     description: 'Unsalted Butter',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 3
        // },
        // {
        //     id: '5',
        //     label: 'Cheese',
        //     description: 'Cheddar Cheese',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 4,
        //     group: 'A'
        // },
        // {
        //     id: '6',
        //     label: 'Apples',
        //     description: 'Red Apples',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 5,
        //     group: 'A'
        // },
        // {
        //     id: '7',
        //     label: 'Bananas',
        //     description: 'Yellow Bananas',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 6
        // },
        // {
        //     id: '8',
        //     label: 'Oranges',
        //     description: 'Navel Oranges',
        //     store: 'Walmart',
        //     quantity: 1,
        //     units: 1,
        //     favorited: false,
        //     order: 7,
        //     group: 'A'
        // },
    ]);

    const [groups, setGroups] = useState<Group[]>([
        // {id: 'A', label: 'Group A', items: items.filter(item => item.group === 'A')},
        // {id: 'B', label: 'Group B', items: items.filter(item => item.group === 'B')},
        // {id: 'Ungrouped', label: 'Ungrouped', items: items.filter(item => item.group == null)},
    ]);

// Helper to fetch the shopping list data from the server
    const fetchShoppingListData = async (listId, jwtToken) => {
        const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    };

    const parseSubheadingsToGroups = (subheadings) => {
        return subheadings.map((subheading) => ({
            id: `${subheading.id}`,
            label: subheading.name,
            items: subheading.items.map((item) => ({
                id: `${item.id}`,
                name: item.name,
                description: item.description || '',
                store: item.store || '',
                quantity: item.quantity || 1,
                units: item.units || 1,
                favorited: item.favorited || false,
                order: item.order || 0,
                checked: item.checked || false,
                group: subheading.name,

            })),
        }));
    };

    const appendInputItemsToGroups = (groups) => {
        return groups.map((group) => ({
            ...group,
            items: [
                ...group.items,
                {
                    id: `input-${group.id}-${Date.now()}`,
                    name: 'Add Item',
                    description: '',
                    store: '',
                    quantity: 0,
                    units: 1,
                    favorited: false,
                    order: group.items.length + 1,
                    group: group.label,
                    isInput: true,
                },
            ],
        }));
    };

    const fetchShoppingList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;

            const {name, subheadings} = await fetchShoppingListData(listId, jwtToken);

            setShoppingListName(name);

            let groups = parseSubheadingsToGroups(subheadings);
            groups = appendInputItemsToGroups(groups);

            setGroups(groups);
        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };

    const renderGroup = ({group}: { group: Group }) => {
        return (
            <DraggableGroup
                key={group.id}
                header={group.label}
                items={group.items}
                groupId={group.id}
                onRegisterItems={registerItems}
                onDrop={(position, groupId, index) => handleDrop(position, groupId, index)}
                onAdd={(newItem) => handleAdd(newItem)}
                handleRemoveItem={handleRemoveItem}
                callingFrom={"grocery_items/unoptimized"}
            />
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
    const handleAdd = async (newItem) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticItem = {...newItem, id: tempId};

        // Optimistically add the new item
        setGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const targetGroup = updatedGroups.find((g) => g.id === newItem.group);

            if (targetGroup) {
                targetGroup.items.splice(targetGroup.items.length - 1, 0, optimisticItem);
            }

            return updatedGroups;
        });

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery_items/unoptimized/`,
                {
                    list: local.id,
                    name: newItem.name,
                    quantity: newItem.quantity,
                    units: newItem.units,
                    store: newItem.store,
                    subheading: newItem.group,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
            // Once you have the group, set the old item to the new item
            setGroups((prevGroups) => {
                const updatedGroups = [...prevGroups];
                const targetGroup = updatedGroups.find((g) => g.id === newItem.group);

                if (targetGroup) {
                    const itemIndex = targetGroup.items.findIndex((item) => item.id === tempId);
                    if (itemIndex !== -1) {
                        // Update the item's ID with the API's response
                        targetGroup.items[itemIndex] = {...response.data};
                    }
                }

                return updatedGroups;
            });
        } catch (error) {
            console.log(`Could not add item to list! Error: ${error}`);
            // If there's an error, rollback the changes
            // TODO: Add an alert to the user
            setGroups((prevGroups) => {
                const updatedGroups = [...prevGroups];
                const targetGroup = updatedGroups.find((g) => g.id === newItem.group);

                if (targetGroup) {
                    targetGroup.items = targetGroup.items.filter((item) => item.id !== tempId);
                }

                return updatedGroups;
            });
        }
    };

    const handleRemoveItem = async (deletedItem) => {
        const originalGroups = [...groups];
        // Optimistic update
        const updatedGroups = groups.map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== deletedItem.id),
        }));
        const filteredGroups = updatedGroups.filter((group) => group.items.length > 0);
        setGroups(filteredGroups);
        console.log("Calling remove item");

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.delete(
                `${API_BASE_URL}/api/grocery_items/unoptimized/${deletedItem.id}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
        } catch (error) {
            console.error('Failed to delete item. Rolling back changes:', error);

            // Rollback: Restore the removed item and group if necessary
            setGroups(originalGroups);
        }
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
                            closestItem = {group, idx};
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

    const [selectedButton, setSelectedButton] = useState("Recipe")
    const renderModal = () => {
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

        // State to manage the dynamically loaded data
        const [data, setData] = useState([]);

        // Effect to load data when the selected tab changes
        useEffect(() => {
            const fetchData = async () => {
                const result = await loadData();
                setData(result);
            };
            fetchData();
        }, [selectedButton]);

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


    return (
        <GestureHandlerRootView style={styles.gestureContainer}>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Header header={shoppingListName} backButton={true} backLink="/shopping" noProfile={false}/>
                    <FlatList
                        data={groups}
                        renderItem={({item}) => renderGroup({group: item})}
                        keyExtractor={group => group.id}
                        style={styles.groupListContainer}
                    />
                    {/*ADD FAVORITES*/}
                    <TouchableOpacity style={styles.starButton} onPress={() => setModalVisible(true)}>
                        <Icon name="star-outline" size={24} color={Colors.light.background}/>
                    </TouchableOpacity>


                    {/*OPTIMIZE*/}
                    <TouchableOpacity style={styles.optimizeButton}>
                        <Icon
                            name="hammer-outline"
                            size={24}
                            color={Colors.light.background}
                        />
                    </TouchableOpacity>
                    {renderModal()}
                    {/*ADD FOLDER*/}
                    <TouchableOpacity style={styles.folderButton} onPress={() => addGroup()}>
                        <Icon
                            name="folder-outline"
                            size={24}
                            color={Colors.light.background}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                <Footer/>
            </View>
        </GestureHandlerRootView>
    );
}

/*
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
});
*/