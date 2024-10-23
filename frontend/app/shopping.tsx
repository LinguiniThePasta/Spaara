import React, { useState, useEffect } from 'react';
import { Keyboard, Animated, TouchableWithoutFeedback, Alert, View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '@/components/config';
import { Link, router } from 'expo-router';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function ShoppingListScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [shoppingLists, setShoppingLists] = useState([]);
    const [newItem, setNewItem] = useState({ id: '', title: '', date: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [animations, setAnimations] = useState({});

        //TEMP SHOPPING LISTS
    /*
    setShoppingLists( [
        {id: '1', title: "My Shopping List 1", date: "10/10/24"},
        {id: '2', title: "My Shopping List 2", date: "10/10/24"},
        {id: '3', title: "Lingyu’s Shopping List", date: "10/10/24"},
    ]);
    */

    // Tested code actually pulls lists correctly from backend, but is commented out for now until we fix login
    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery/`, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });
                        
            const lists = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
                date: new Date(item.creation_time).toLocaleDateString(),
            }));

            // Initialize animations for each list item
            lists.forEach(list => {
                animations[list.id] = new Animated.Value(0);
            });

            console.log("Correctly fetched shopping lists!");
            setShoppingLists(lists);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    }

    const handleAddList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/grocery/`, {
                name: newItem.title,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            fetchShoppingLists();
            // Close modal
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding new shopping list:', error);
        }
    };

    const handleDeleteList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.delete(`${API_BASE_URL}/api/grocery/${selectedList.id}/`, 
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                }
            });

            // Refresh the shopping lists after deleting one
            fetchShoppingLists();
        } catch (error) {
            console.error('Error deleting shopping list:', error);
        }
    };

    const handleLongPress = (list) => {

        if (selectedList && selectedList.id !== list.id) {
            // Reverse the animation for the previously selected list
            Animated.timing(animations[selectedList.id], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setSelectedList(list);
                setShowDeleteOptions(true);
                setEditMode(true);
                setEditedTitle(list.title);
                // Start the animation for the newly selected list
                Animated.timing(animations[list.id], {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            setSelectedList(list);
            setShowDeleteOptions(true);
            setEditMode(true);
            setEditedTitle(list.title);
            // Start the animation for the newly selected list
            Animated.timing(animations[list.id], {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const addItem = () => {
        const newId = (shoppingLists.length + 1).toString();
        setNewItem({ id: newId, title: '', date: new Date().toLocaleDateString() });
        setModalVisible(true);
        console.log('Adding new item:', newItem);
    };

    const handleTitleChange = (text) => {
        setNewItem({ ...newItem, title: text });
    };

    const handleTitleSubmit = () => {
        if (newItem.title.trim() !== '') {
            const updatedShoppingLists = [...shoppingLists, newItem];
            setShoppingLists(updatedShoppingLists);
            setModalVisible(false);
            setNewItem({ id: '', title: '', date: '' });
            console.log('New item added:', newItem);
            console.log('Updated shopping lists:', updatedShoppingLists);
        }
    };

    const handleRename = () => {
        setShoppingLists(shoppingLists.map(list => 
            list.id === selectedList.id ? { ...list, title: editedTitle } : list
        ));
        setEditMode(false);
        setShowDeleteOptions(false);
        Animated.timing(animations[selectedList.id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleDeleteButtonPress = () => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this list? Deleted lists cannot be restored.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: handleDeleteList }
            ],
            { cancelable: false }
        );
    };

    const handleDelete = () => {
        setShoppingLists(shoppingLists.filter(list => list.id !== selectedList.id));
        setShowDeleteOptions(false);
        setEditMode(false);
        Animated.timing(animations[selectedList.id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleOutsideClick = () => {
        if (editMode) {
            Animated.timing(animations[selectedList.id], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setEditMode(false);
                setShowDeleteOptions(false);
                setSelectedList(null);
            });
        }
        Keyboard.dismiss();
    };

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => router.push(`/modifyshopping?id=${item.id}&title=${encodeURIComponent(item.title)}&date=${item.date}`)}
            onLongPress={() => handleLongPress(item)}
        >
            <View style={styles.listItem}>
                {selectedList?.id === item.id && showDeleteOptions && (
                    <Animated.View style={[styles.deleteBlock, { transform: [{ translateX: animations[item.id] || new Animated.Value(0) }] }]}>
                        <TouchableOpacity onPress={handleDeleteButtonPress}>
                            <Text style={styles.deleteBlockText}>Delete</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                <Animated.View style={[styles.listItemLeft, { transform: [{ translateX: animations[item.id] || new Animated.Value(0) }] }]}>
                    {editMode && selectedList?.id === item.id ? (
                        <TextInput
                            style={styles.renameInput}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            onSubmitEditing={handleRename}
                        />
                    ) : (
                        <Text style={styles.listItemTitle}>{item.title}</Text>
                    )}
                    <Text style={styles.listItemDate}>{item.date}</Text>
                </Animated.View>
            </View>
        </Pressable>
    );

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Header header={"Shopping Lists"} />
                    <View style={globalStyles.searchBar}>
                        <Icon name="search-outline" size={20} color={Colors.light.primaryColor} style={styles.searchIcon} />
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
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Icon name="add" size={24} color="white" />
                    </TouchableOpacity>
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                        <Icon name="close" size={24} color={Colors.light.primaryText} />
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>Add New Shopping List</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter item title"
                                    value={newItem.title}
                                    onChangeText={handleTitleChange}
                                    onSubmitEditing={handleAddList}
                                    autoFocus
                                />
                                <TouchableOpacity onPress={handleAddList} style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                </SafeAreaView>
                <Footer />
            </View>
        </TouchableWithoutFeedback>
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
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
        position: 'relative',
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
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: Colors.light.primaryColor,
        borderRadius: 50,
        padding: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    closeButton: {
        marginRight: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black', // Ensure the text color contrasts with the background
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.light.secondaryText,
        borderRadius: 5,
        marginBottom: 10,
    },
    renameInput: {
        fontSize: 16, // Smaller font size
        paddingVertical: 5, // Smaller vertical padding
        paddingHorizontal: 10,
        color: Colors.light.primaryText,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
    },
    submitButton: {
        backgroundColor: Colors.light.primaryColor,
        padding: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    deleteBlock: {
        position: 'absolute',
        left: -120,
        top: 0,
        bottom: 0,
        width: 100,
        backgroundColor: '#FF6347',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBlockText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
