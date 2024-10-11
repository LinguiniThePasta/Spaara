import React, {useEffect} from 'react';
import {
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    Button,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {CoreBridge, HistoryBridge, RichText, TaskListBridge, Toolbar, useEditorBridge} from '@10play/tentap-editor';
import NavigationButton from "@/components/NavigationButton";
import Footer from "@/components/Footer";
//import CheckBox from 'react-native-check-box'
import TabsFooter from "@/components/TabsFooter"
import {API_BASE_URL} from "@/components/config";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function FavoritedItems() {
    const [items, setItems] = React.useState([]);
    const [newItemName, setNewItemName] = React.useState('');
    const [newItemQuantity, setNewItemQuantity] = React.useState('');

    const removeItem = async (index) => {
        try {
            // Get the ID of the item to be deleted
            const itemId = items[index].id;

            // Send a DELETE request to the server to remove the item
            const response = await fetch(`${API_BASE_URL}/api/favorites/delete?id=${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`,
                },
            });

            // Check if the response was successful
            if (response.ok) {
                // Update the local state only if the server deletion was successful
                const updatedItems = items.filter((_, i) => i !== index);
                setItems(updatedItems);
                console.log(`Item with ID ${itemId} successfully deleted.`);
            } else {
                console.error('Failed to delete item from server:', response.statusText);
                alert('Failed to delete item from the server. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('An error occurred while deleting the item. Please try again.');
        }
    };


    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/favorites/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                    },
                });

                const jwtToken = await SecureStore.getItemAsync('jwtToken');
                console.log('JWT Token:', jwtToken);
                if (!response.ok) {
                    console.log('Failed to fetch items from the server');
                }

                const data = await response.json();
                console.log(data);

                const transformedItems = data.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    store: item.store
                }));

                // Update the state with the transformed items
                setItems(transformedItems);
                console.log('Transformed Items:', transformedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        getItems();
    }, []);
    return (
        <View style={styles.container}>

            <View style={styles.headerContainer}>
                {/*<NavigationButton label="Back" type="back" destination="/welcome"/>*/}
                <View style={styles.headerSpacer}/>
                <Text style={styles.headerLabel}>My Favorite Items</Text>
                <View style={styles.headerSpacer}/>
            </View>

            {/* Scrollable List of Items */}
            <ScrollView contentContainerStyle={styles.itemListContainer}>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <TouchableOpacity style={styles.itemButton}>
                            <Text style={styles.itemText}>{'Name: ' + item.name}</Text>
                            <Text style={styles.itemText}>{'Store: ' + item.store}</Text>
                            <Text style={styles.itemText}>{'Price: $' + item.price}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index)}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <TabsFooter/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        //paddingHorizontal: 16,
        //paddingTop: 40,
    },

    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 100,
        backgroundColor: '#F6AA1C',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerLabel: {
        width: 290,
        marginTop: 50,
        marginBottom: 10,
        color: '#232528',
        fontSize: 28,
        textAlign: 'center',
    },

    headerSpacer: {
        width: 50,
        height: 50,
        marginTop: 50,
        marginBottom: 10,
    },

    searchBarContainer: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 8,
    },
    searchBar: {
        height: 40,
        backgroundColor: '#dcdcdc',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    settingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    settingsItem: {
        fontSize: 14,
        color: '#333',
    },
    addItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addItemInput: {
        flex: 1,
        backgroundColor: '#dcdcdc',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginRight: 8,
        height: 40,
    },
    itemListContainer: {
        //paddingBottom: 16,
        marginVertical: 30,
        marginHorizontal: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemButton: {
        flex: 1,
        backgroundColor: '#b0b0b0',
        borderRadius: 8,
        padding: 8,
    },
    itemText: {
        color: '#fff',
    },
    quantityButton: {
        backgroundColor: '#999',
        borderRadius: 8,
        padding: 8,
        marginLeft: 8,
    },
    quantityText: {
        color: '#fff',
    },
    checkbox: {
        flex: 1,
        padding: 10,
    },
    removeButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        padding: 8,
        marginLeft: 8,
    },
    removeButtonText: {
        color: '#fff',
    },
});
