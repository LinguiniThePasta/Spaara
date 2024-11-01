import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {ItemGroup} from '@/components/ItemGroup';
import {CheckItem, FavoriteItem, InputItem} from '@/components/Item';
import Recipe from './recipe';
import { Drawer, Divider, Button as PaperButton, List } from 'react-native-paper';
//import { setSearchQuery } from '../store/shoppingListSlice';


export default function ShoppingListScreen() {
    const router = useRouter();
    const local = useLocalSearchParams();
    const [shoppingLists, setShoppingLists] = useState([]);
    const [shoppingListName, setShoppingListName] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const [shoppingItems, setShoppingItems] = useState([
        /*{ id: 998, title: 'Ham', price: 3.99, favorited: false, checked: false },
        { id: 999, title: 'Cheese', price: 4.99, favorited: false, checked: false },
        { id: -1, title: '', price: 0, favorited: false, checked: false },*/
    ]);
    const [favoriteItems, setFavoriteItems] = useState([
        {id: 1, title: 'Milk', favorited: true},
        {id: 2, title: 'Rice', favorited: true},
    ]);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');


    const [recipeTemp, setRecipe] = useState([
        {id: 1, title: 'Beefed Banana'},
        {id: 2, title: 'Porked Lemons'},
    ]);


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedButton, setSelectedButton] = useState('Favorite');
    const [contentVisable, setContentVisable] = useState('Favorite');
    const [expandedAccordions, setExpandedAccordions] = useState({});

    const [itemGroups, setItemGroups] = useState([
        {id: 1001, title: "Smallga", items: [{ id: 996, title: 'Ham', price: 3.99, favorited: false, checked: false, quantity: 1 },
                                         { id: 997, title: 'Cheese', price: 4.99, favorited: false, checked: false, quantity: 1 },]},
        {id: 1002, title: "Bigitte", items: [{ id: 998, title: 'Big Ham', price: 3.99, favorited: false, checked: false, quantity: 1 },
                                         { id: 999, title: 'Biggy Cheese', price: 4.99, favorited: false, checked: false, quantity: 1 },]},
    ]);

    const [optimizedGroups, setOptimizedGroups] = useState([
        {id: 1003, title: "Walmart", items: []},
        {id: 1004, title: "Kroger", items: []},
    ]);


    const handlePress = (button) => {
        setSelectedButton(button);
        setContentVisable(button);
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


    const fetchShoppingList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery/${local.id}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            console.log("Correctly fetched shopping list!");
            setShoppingListName(response.data.name);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    };


    const fetchShoppingItems = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery_items/unoptimized/?list=${local.id}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            const items = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
                price: 0,
                favorited: item.favorited,
                checked: false,
                list: item.list.toString(),
                quantity: item.quantity,
            }));

            const filteredItems = items.filter(item => item.list === local.id)
            console.log(filteredItems);
            console.log("Correctly fetched shopping items!");
            setShoppingItems([...itemGroups, ...filteredItems, {
                id: -1,
                title: 'Add Item',
                price: 0,
                favorited: false,
                checked: false,
                list: local.id,
                quantity: 0,
            }]);

            shoppingItems.forEach(
                (item) => {console.log(item.title + ": " + item.id)}
            );

        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };

    const handleOptimize = async () => {
        try {
            /*
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery_items/unoptimized/?list=${local.id}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            */
            
            // Initialize new optimizedGroups with empty items arrays
            const updatedOptimizedGroups = optimizedGroups.map(group => ({
                ...group,
                items: [],
            }));
    
            // Flatten items from shoppingItems
            const allItems = [];
            shoppingItems.forEach(item => {
                if (item.items && item.items.length > 0) {
                    // Item is a group; extract its items
                    allItems.push(...item.items);
                } else {
                    // Standalone item
                    allItems.push(item);
                }
            });

            // Loop through each item and assign randomly
            allItems.forEach(item => {
                if (item.id !== -1) {
                    const random = Math.floor(Math.random() * 2); // 0 or 1
                    if (random === 0) {
                        // Assign to the first optimized group
                        updatedOptimizedGroups[0].items.push(item);
                    } else {
                        // Assign to the second optimized group
                        updatedOptimizedGroups[1].items.push(item);
                    }
                }
            });

            // Create the 'Add Item' object
            const addItem = {
                id: -1,
                title: 'Add Item',
                price: 0,
                favorited: false,
                checked: false,
                list: local.id,
                quantity: 0,
            };

            // Update the state with the new optimizedGroups
            setShoppingItems([...updatedOptimizedGroups, addItem]);
        } catch (error) {
            console.error('Error optimizing:', error);
        }
    };

    const fetchItemGroups = async () => {
        try {
            /*const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery_items/unoptimized/?list=${local.id}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });*/

            /*const items = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
                price: 0,
                favorited: item.favorited,
                checked: false,
                list: item.list.toString(),
                quantity: item.quantity,
            }));*/

            //const filteredItems = items.filter(item => item.list === local.id)

            const filteredItems = itemGroups

            console.log("Correctly fetched item groups!");
            /*setShoppingItems([...filteredItems, {
                id: -1,
                title: 'Add Item',
                price: 0,
                favorited: false,
                checked: false,
                list: local.id,
                quantity: 0,
            }]);*/
            setShoppingItems([...shoppingItems, ...filteredItems])
        } catch (error) {
            console.error('Error fetching item groups:', error);
        }
    };



    useEffect(() => {
        //fetchItemGroups();
        fetchShoppingItems();
        fetchShoppingList();
    }, []); // Empty dependency array ensures this runs only on component mount


    const handleAddItem = async () => {
        console.log("Adding this: " + newItemName);
        if (newItemName === "-1") return;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery_items/unoptimized/`, {
                name: newItemName,
                quantity: 1,
                units: "units",
                list: local.id,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            fetchShoppingItems();
            setNewItemName("");
        } catch (error) {
            console.error('Error adding new shopping item:', error);
        }
    };

    const handleRemove = async (item) => {
        console.log(`Removing item with ID: ${item.id}`);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.delete(`${API_BASE_URL}/api/grocery_items/unoptimized/${item.id}/?list=${local.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jwtToken,
                    }
                });

            // Refresh the shopping lists after adding a new one
            setNewItemName('');
            fetchShoppingItems();
        } catch (error) {
            console.error('Error removing shopping item:', error);
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

    const renderItem = ({item}) => {
        const isInput = (item.id === -1);
        const isGroup = (item.id >= 1000);

        if (isInput) {
            return (
                <View>
                    <InputItem onChangeText={setNewItemName} handleAddItem={handleAddItem}></InputItem>
                </View>
            );
        }

        if (isGroup) {
            return (
                <View>
                    <ItemGroup name={item.title} items={item.items} onChangeText={setNewItemName} handleAddItem={handleAddItem}></ItemGroup>
                </View>
            );
        }

        return (
            <View style={styles.checkItemContainer}>
                {isInput === false ? (
                    <CheckItem item={item} handleFavoriteItem={handleFavorite} handleRemoveItem={() => handleRemove(item)}></CheckItem>
                ) : (
                    <InputItem onChangeText={setNewItemName} handleAddItem={handleAddItem}></InputItem>
                )}
            </View>
        );
    };

    const renderFavoriteItem = ({item}) => (
        <FavoriteItem item={item} addFavoriteItem={setFavoriteItems} removeFromFavorite={setFavoriteItems}></FavoriteItem>
    );

    const renderRecipe = ({item}) => (
        <View style={styles.recipeContainer}>
            <View style={styles.recipeLeft}>
                <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <View style={styles.recipeRight}>
                <Pressable onPress={() => console.log('Add pressed for ${item.title}')}>
                    <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.icon}/>                    
                </Pressable>
            </View>
        </View>
    );

    const renderItemGroup = ({item}) => (
        <ItemGroup name={item.name} items={shoppingItems} handleFavoriteItem={() => handleFavorite(item)} handleRemoveItem={() => handleRemove(item)} onChangeText={setNewItemName} handleAddItem={handleAddItem}></ItemGroup>
    );
    const dismissModal = () => {
        setIsRenameModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.left}>
                        <Pressable onPress={() => router.push('/shopping')} style={{paddingRight: 10, marginLeft: -10}}>
                            <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText}/>
                        </Pressable>
                        <Text style={styles.headerTitle}>{`${shoppingListName}`}</Text>
                        <TouchableOpacity style={{marginLeft: 10}} onPress={() => setIsRenameModalVisible(true)}>
                            <Icon name="pencil-outline" size={24} color={Colors.light.primaryText} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileIconContainer}></View>
                </View>

                {/*<FlatList
                    data={shoppingItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />*/}

                {/*<ItemGroup name={"Smallga"} items={shoppingItems} onChangeText={setNewItemName} handleAddItem={handleAddItem}></ItemGroup>*/}

                {/*<FlatList
                    data={itemGroups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItemGroup}
                    contentContainerStyle={styles.listContainer}
                />*/}


                <FlatList
                    data={shoppingItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
                
                
                <TouchableOpacity style={styles.starButton} onPress={() => setModalVisible(true)}>
                    <Icon name="star-outline" size={24} color={Colors.light.primaryText}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optimizeButton} onPress={handleOptimize}>
                    <Icon
                        name="hammer-outline"
                        size={24}
                        color={Colors.light.primaryText}
                    />
                </TouchableOpacity>

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
                                <Text style={styles.nameModalTitle}>Rename Shopping List</Text>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="Enter new name"
                                    value={newListName}
                                    onChangeText={setNewListName}
                                />
                                <Button title="Rename" onPress={handleRename} />
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
                                data={recipeTemp}
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
    itemTitle: {
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
    listItemTitle: {
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
    modalTitle: {
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
    nameModalTitle: {
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
    // Optimization drawers
    optContainer: {
        marginTop: 16,
        width: '100%',
    },
    drawer: {
        marginTop: 16,
    },
    accordion: {
        backgroundColor: 'transparent',
    },
    accordionTitle: {
        color: Colors.light.primaryText,
    },
});