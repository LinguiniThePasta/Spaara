import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {isAuthenticated} from "@/components/Axios";
import * as SecureStore from "expo-secure-store";
import {API_BASE_URL} from "@/components/config";
import TabsFooter from "@/components/TabsFooter"

export default function Shopping() {
    const [items, setItems] = useState([
        {name: 'Item', quantity: 'x3', checked: false},
        {name: 'Item 2', quantity: 'x2', checked: false},
        {name: 'Item 3', quantity: 'x10', checked: false},
        {name: 'Item 4', quantity: 'x1', checked: false},
    ]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [listName, setListName] = useState('');

    const addItem = () => {
        if (newItemName && newItemQuantity) {
            setItems([...items, {name: newItemName, quantity: `x${newItemQuantity}`, checked: false}]);
            setNewItemName('');
            setNewItemQuantity('');
        }
    };

    const removeItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const toggleCheckbox = (index) => {
        const updatedItems = items.map((item, i) =>
            i === index ? {...item, checked: !item.checked} : item
        );
        setItems(updatedItems);
    };

    const handleSave = async () => {
        // Prompt the user for the shopping list name
        Alert.prompt(
            'Save Shopping List',
            'Enter the name of your shopping list:',
            async (name) => {
                if (name) {
                    setListName(name);
                    const content = items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        checked: item.checked,
                    }));

                    const shoppingList = {
                        name: name,
                        content: JSON.stringify(content),
                    };


                    if (await isAuthenticated()) {
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/shopping/create`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                                },
                                body: JSON.stringify(shoppingList),
                            });

                            if (response.ok) {
                                Alert.alert('Success', 'Shopping list saved to server!');
                            } else {
                                Alert.alert('Error', 'Failed to save shopping list to server.');
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert('Error', 'Network error while saving shopping list.');
                        }
                    } else {
                        try {
                            await AsyncStorage.setItem(`@shopping_list_${name}`, JSON.stringify(shoppingList));
                            Alert.alert('Success', 'Shopping list saved locally!');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to save shopping list locally.');
                        }
                    }
                } else {
                    Alert.alert('Error', 'List name is required to save the shopping list.');
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for item"
                    placeholderTextColor="#666"
                />
            </View>

            {/* Settings Row */}
            <View style={styles.settingsRow}>
                <Button title="No. of stores" onPress={() => {
                }}/>
                <Button title="Max distance" onPress={() => {
                }}/>
                <Button title="Save" onPress={handleSave}/>
            </View>

            {/* Input for adding new items */}
            <View style={styles.addItemContainer}>
                <TextInput
                    style={styles.addItemInput}
                    placeholder="New item name"
                    value={newItemName}
                    onChangeText={setNewItemName}
                />
                <TextInput
                    style={styles.addItemInput}
                    placeholder="Quantity"
                    value={newItemQuantity}
                    onChangeText={setNewItemQuantity}
                    keyboardType="numeric"
                />
                <Button title="Add Item" onPress={addItem}/>
            </View>

            {/* Scrollable List of Items */}
            <ScrollView contentContainerStyle={styles.itemListContainer}>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <TouchableOpacity style={styles.itemButton}>
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={styles.quantityButton}>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                        </View>
                        <CheckBox
                            style={styles.checkbox}
                            onClick={() => toggleCheckbox(index)}
                            isChecked={item.checked}
                            leftText={null}
                        />
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
        paddingHorizontal: 16,
        paddingTop: 40,
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
        paddingBottom: 16,
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
