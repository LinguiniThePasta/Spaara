import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import axios from 'axios';
import { API_BASE_URL } from '@/scripts/config';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
//import { setSearchQuery } from '../store/shoppingListSlice';

export default function ShoppingListScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const local = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [shoppingLists, setShoppingLists] = useState([]);
    const [shoppingListName, setShoppingListName] = useState("");
    const [newItem, setNewItem] = useState({ id: -1, title: "EYES!", favorited: false, checked: false });
    const [newItemName, setNewItemName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [shoppingItems, setShoppingItems] = useState([
        /*{ id: 998, title: 'Ham', price: 3.99, favorited: false, checked: false },
        { id: 999, title: 'Cheese', price: 4.99, favorited: false, checked: false },
        { id: -1, title: '', price: 0, favorited: false, checked: false },*/
    ]);
    const [favoriteItems, setFavoriteItems] = useState([
        { id: 1, title: 'Milk', favorited: true },
        { id: 2, title: 'Rice', favorited: true },
    ]);

    const [modalVisible, setModalVisible] = useState(false);



    const fetchShoppingLists = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
    
            const response = await axios.get(`${API_BASE_URL}/api/grocery/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
    
            const lists = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
            }));

            let listName = "Unnamed List";
            lists.forEach(list => {
                if (list.id === local.id) {
                    listName = list.title;
                }
            });
            
            console.log("Correctly fetched shopping lists!");
            setShoppingListName(listName);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    };



    const fetchShoppingItems = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery_items/unoptimized/`, {
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
                list: item.list.toString()
            }));

            const filteredItems = items.filter(item => item.list === local.id)

            console.log("Correctly fetched shopping items!");
            setShoppingItems([...filteredItems, { id: -1, title: 'Add Item', price: 0, favorited: false, checked: false, list: local.id } ]);
        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };
    useEffect(() => {
        // Call the function to load shopping lists when the component mounts
        fetchShoppingLists();
        fetchShoppingItems();
    }, []); // Empty dependency array ensures this runs only on component mount



    const handleAddItem = async () => {
        console.log("Adding this: " + newItemName);
        if (newItemName === "-1") return;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery_items/unoptimized/`, {
                list: local.id,
                name: newItemName,
                quantity: 1,
                units: "units",
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            setNewItemName('');
            fetchShoppingItems();
        } catch (error) {
            console.error('Error adding new shopping item:', error);
        }
    };



    const handleFavorite = async (id) => {
        // Simulate favoriting an item
        setShoppingLists(prevLists =>
            prevLists.map(item =>
                item.id === id ? { ...item, favorited: !item.favorited } : item
            )
        );
        setFavoriteItems(prevFavorites =>
            prevFavorites.map(item =>
                item.id === id ? { ...item, favorited: !item.favorited } : item
            )
        );
    };



    const renderItem = ({ item }) => {
        const priceText = item.price === 0 ? '' : '$' + item.price;
        const isInput = (item.id === -1);
        const dummyString = "-1";
        return (
        <View style={styles.itemContainer}>
            <View style={styles.itemLeftContainer}>
                {/* Star Icon */}
                <Pressable onPress={() => console.log(`Check pressed for ${item.title}`)}>
                    <Icon name="ellipse-outline" size={24} color={Colors.light.secondaryText} style={styles.icon} />
                </Pressable>
                <View style={styles.itemTextContainer}>
                    <TextInput
                        style={styles.itemTitle}
                        placeholder={item.title}
                        placeholderTextColor={(isInput) ? Colors.light.secondaryText : Colors.light.primaryText}
                        editable={isInput}
                        onChangeText={(text) => setNewItemName(text)}
                        onSubmitEditing={() => handleAddItem()}
                    />
                    <View style={styles.itemInfoContainer}>
                        <Text style={styles.itemPrice}>{priceText}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.itemIconContainer}>
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
    )};

    const renderFavoriteItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View>
                    <Header header={`${shoppingListName}`} backButton={true} backLink={"/shopping"}></Header>
                    {/*<Text style={styles.itemTitle}>$10.00 Budget</Text>*/}
                </View>
                {/*<View style={globalStyles.searchBar}>
                        <Icon name="search-outline" size={20} color={Colors.light.primaryColor}
                              style={styles.searchIcon}/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={Colors.light.secondaryText}
                            value={searchQuery}
                            onChangeText={(text) => dispatch(setSearchQuery(text))}
                        />
                    </View>*/}
                    <FlatList
                        data={shoppingItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />

                <TouchableOpacity style={styles.heartButton} onPress={() => setModalVisible(true)}>
                    <Icon name="heart-outline" size={24} color={Colors.light.background} />
                </TouchableOpacity>
            </SafeAreaView>
            <Footer />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="close-outline" size={40} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Favorite Item</Text>
                        <FlatList
                            data={favoriteItems}
                            renderItem={renderFavoriteItem}
                            keyExtractor={item => item.id.toString()}
                        />
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
    heartButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#FF6347', // Tomato color
        borderRadius: 50,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartButtonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
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
});