import React, { useState, useEffect } from 'react';
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
    TouchableWithoutFeedback,
    Button
     } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import axios from 'axios';
import { API_BASE_URL } from '@/scripts/config';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header"; // Use your color definitions
import * as SecureStore from 'expo-secure-store';

export default function RecipeListScreen() {
    const router = useRouter();
    const local = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [recipeName, setRecipeName] = useState('');
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [newItem, setNewItem] = useState({ id: '', title: '', date: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');

    const fetchRecipe = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/recipe/${local.id}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            console.log("Correctly fetched recipe!");
            setRecipeName(response.data.name);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    };

    useEffect(() => {
        //fetchItemGroups();
        fetchRecipe();
    }, []); // Empty dependency array ensures this runs only on component mount

    const dismissModal = () => {
        setIsRenameModalVisible(false);
    }

    const handleRename = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;
            const payload = {
                name: newListName,
            };
            const response = await axios.put(`${API_BASE_URL}/api/recipe/${listId}/`, payload, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });
            // Handle successful response
            console.log('Recipe renamed:', response.data);
        } catch (error) {
            console.error('Error renaming recipe:', error);
            // Handle error (e.g., show a notification)
        } finally {
            setIsRenameModalVisible(false);
            setRecipeName(newListName);
            setNewListName("");
        }
    };


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.left}>
                        <Pressable onPress={() => router.push('/recipe')} style={{paddingRight: 10, marginLeft: -10}}>
                            <Icon name="chevron-back-outline" size={40} color={Colors.light.primaryText}/>
                        </Pressable>
                        <Text style={styles.headerTitle}>{`${recipeName}`}</Text>
                        <TouchableOpacity style={{marginLeft: 10}} onPress={() => setIsRenameModalVisible(true)}>
                            <Icon name="pencil-outline" size={24} color={Colors.light.primaryText} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileIconContainer}></View>
                </View>
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
    // Custom header
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
});