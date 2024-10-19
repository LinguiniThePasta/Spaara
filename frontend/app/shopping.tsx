import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import axios from 'axios';
import { API_BASE_URL } from '@/components/config';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header"; // Use your color definitions

export default function ShoppingListScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [shoppingLists, setShoppingLists] = useState([]);
    const [newItem, setNewItem] = useState({ id: '', title: '', date: '' });
    const [modalVisible, setModalVisible] = useState(false);
    //TEMP SHOPPING LISTS
    /*
    setShoppingLists( [
        {id: '1', title: "My Shopping List 1", date: "10/10/24"},
        {id: '2', title: "My Shopping List 2", date: "10/10/24"},
        {id: '3', title: "Lingyu’s Shopping List", date: "10/10/24"},
    ]);
    */

    // Tested code actually pulls lists correctly from backend, but is commented out for now until we fix login
    /*
    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        const tempKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5MzE1NDU1LCJpYXQiOjE3MjkzMTUxNTUsImp0aSI6IjkwZDA0ZTBjYWVhZTQ2M2E4N2Q5ZDBlZmM3YjA5ZjcxIiwidXNlcl9pZCI6M30.GhSeb6Q2LkwPijL_XXU29dw6kTUxIYdPPXppWmGnaa4';
        try {
            const response = await axios.get(`${API_BASE_URL}/api/grocery/`, {
                headers: {
                    'Authorization': 'Bearer ' + tempKey,
                }
            });

            const lists = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
                date: new Date(item.creation_time).toLocaleDateString(),
            }));
            console.log("Correctly fetched shopping lists!");
            setShoppingLists(lists);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    };
    */

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

    const renderItem = ({ item }) => (
        <Pressable onPress={() => router.push(`/modifyshopping?id=${item.id}&title=${encodeURIComponent(item.title)}&date=${item.date}`)}>
            <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemDate}>{item.date}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={24} color={Colors.light.secondaryText} />
            </View>
        </Pressable>
    );

    return (
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
                                onSubmitEditing={handleTitleSubmit}
                                autoFocus
                            />
                            <TouchableOpacity onPress={handleTitleSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </SafeAreaView>
            <Footer />
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
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.light.secondaryText,
        borderRadius: 5,
        marginBottom: 10,
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
});