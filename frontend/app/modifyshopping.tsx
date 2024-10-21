import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, FlatList, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import axios from 'axios';
import { API_BASE_URL } from '@/components/config';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header"; // Use your color definitions

export default function ShoppingListScreen() {
    const router = useRouter();
    const local = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [shoppingLists, setShoppingLists] = useState([]);
    const [newItem, setNewItem] = useState({ id: '', title: '', date: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedButton, setSelectedButton] = useState('Favorite');
    const [notSelectedButton, setNotSelectedButton] = useState(false);


    const handlePress = (button) => {
        setSelectedButton(button);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={`Modify List ${local.id}`} />
                <TouchableOpacity style={styles.heartButton} onPress={() => setModalVisible(true)}>
                    <Icon name="add" size={24} color="white" />
                    <Icon name="heart-outline" size={24} color="white" />
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
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}></Text>
                        <View style={styles.favoriteRecipeContainer}>
                            <TouchableOpacity 
                                style={[styles.favoriteRecipeButton, 
                                    selectedButton === 'Recipe' && styles.unselectedButton,
                                    selectedButton === 'Favorite' && styles.selectedButton]}
                                onPress={() => handlePress('Favorite')}
                            >
                                <Text style={[
                                    styles.selectedText,
                                    selectedButton === 'Recipe' && styles.unselectedText,
                                    selectedButton === 'Favorite' && styles.selectedText,
                                ]}>
                                    Favorite
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.favoriteRecipeButton, 
                                    selectedButton === 'Recipe' && styles.selectedButton,
                                    selectedButton === 'Favorite' && styles.unselectedButton]}
                                onPress={() => handlePress('Recipe')}
                            >
                                <Text style={[
                                    styles.selectedText,
                                    selectedButton === 'Recipe' && styles.selectedText,
                                    selectedButton === 'Favorite' && styles.unselectedText,
                                ]}>
                                    Recipe
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.favoriteHeaderText}>Add Favorites</Text>
                        
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 20, // Increased padding for larger clickable area
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
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
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    selectedButton: {
        backgroundColor: Colors.light.primaryColor,
        
    },
    unselectedButton: {
        backgroundColor: 'white',
        borderColor: Colors.light.primaryColor,
        borderWidth: 2,
    },
    selectedText: {
        fontSize: 16,
        color: 'black',
    },
    unselectedText: {
        fontSize: 16,
        color: Colors.light.primaryColor,
    },
    favoriteHeaderText: {
        fontSize: 28,
        color: 'black',
        marginLeft: 20,
        marginTop: 15,
    },
});