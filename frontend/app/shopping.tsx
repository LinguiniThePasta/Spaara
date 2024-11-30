import React, {useState, useEffect} from 'react';
import {
    Keyboard,
    Animated,
    TouchableWithoutFeedback,
    Alert,
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
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_BASE_URL} from '@/scripts/config';
import {Link, router} from 'expo-router';
import {ColorThemes} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import shortenTime from "@/scripts/shortenTime";
import { useDispatch, useSelector } from 'react-redux';
import { setLastAccessedList, setShoppingLists, setSearchQuery } from '../store/shoppingListSlice';
import { setBackground, setPrimaryColor } from '@/store/colorScheme';

/*var Colors = {
    light: ColorThemes.darkMode
};*/
//const Colors = useSelector((state) => state.colorScheme);

export default function Shopping() {
    const dispatch = useDispatch();

    const fetchThemeInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/theme_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            dispatch(setBackground(response.data.background));
            dispatch(setPrimaryColor(response.data.primaryColor));

            console.log("Fetched theme info! background: " + response.data.background + "   primaryColor: " + response.data.primaryColor);

        } catch (error) {
            console.error('Error fetching theme info:', error);
        }
    };

    const Colors = useSelector((state) => state.colorScheme);

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
            backgroundColor: Colors.light.background,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 10,
        },
        closeButton: {
            marginRight: 30,
            marginBottom: 20
        },
        modalTitle: {
            fontSize: 18,
            marginBottom: 20,
            color: Colors.light.primaryText, // Ensure the text color contrasts with the background
        },
        input: {
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.light.primaryColor,
            color: Colors.light.primaryText,
            borderRadius: 5,
            marginBottom: 10,
    
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            paddingHorizontal: 10,
    
    
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
            ...globalStyles.primaryButton,
        },
        submitButtonText: {
            color: Colors.light.background,
            fontWeight: 'bold',
        },
        modalButton: {
            backgroundColor: Colors.light.primaryColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        modalButtonText: {
            color: Colors.light.background,
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
            width: 75,
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





    const [newItem, setNewItem] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [animations, setAnimations] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);

    //const dispatch = useDispatch();
    const shoppingLists = useSelector((state) => state.shoppingList.lists);
    const searchQuery = useSelector((state) => state.shoppingList.searchQuery);
    //const Colors = useSelector((state) => state.colorScheme);

    // Tested code actually pulls lists correctly from backend, but is commented out for now until we fix login
    useEffect(() => {
        fetchThemeInfo();
        fetchShoppingLists();
        dispatch(setLastAccessedList(null));
    }, []);
    const dismissModal = () => {
        Keyboard.dismiss(); // Dismiss keyboard if open
        closeModal(); // Close the modal
    };
    const fetchShoppingLists = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/grocery/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            const lists = response.data.map(item => ({
                id: item.id,
                title: item.name,
                date: shortenTime(item.update_time)
            }));

            // Initialize animations for each list item
            lists.forEach(list => {
                animations[list.id] = new Animated.Value(0);
            });

            console.log("Correctly fetched shopping lists!");
            dispatch(setShoppingLists(lists));
        } catch (error) {
            console.error('Error fetching shopping lists:', error.message);
        }
    }

    const handleAddList = async () => {
        if (isDisabled) return;
        setIsDisabled(true);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            console.log(jwtToken);
            const response = await axios.post(`${API_BASE_URL}/api/grocery/`, {
                name: newItem,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            await fetchShoppingLists();
            closeModal();
        } catch (error) {
            console.error('Error adding new shopping list:', error.message);
            Alert.alert(`Error adding new shopping list: ${error.message}`)
        } finally {
            setIsDisabled(false);
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
            // Start the animation for the newly selected list
            Animated.timing(animations[list.id], {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleTitleChange = (text) => {
        setNewItem(text);
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
                {text: "Delete", onPress: handleDeleteList}
            ],
            {cancelable: false}
        );
    };

    const handleOutsideClick = () => {
        if (selectedList) {
            Animated.timing(animations[selectedList.id], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setSelectedList(null);
                setShowDeleteOptions(false);
            });
        }
        Keyboard.dismiss();
    };

    const handlePress = (item) => {
        router.push(`/modifyshopping?id=${item.id}`);
        dispatch(setLastAccessedList(item.id));
    }

    const closeModal = () => {
        setNewItem("");
        setModalVisible(false);
    }

    const renderItem = ({item}) => (
        <Pressable
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
        >
            <View style={styles.listItem}>
                {selectedList?.id === item.id && showDeleteOptions && (
                    <Animated.View
                        style={[
                            styles.deleteBlock,
                            {transform: [{translateX: animations[item.id] || new Animated.Value(0)}]}
                        ]}
                    >
                        <Pressable
                            onPress={handleDeleteButtonPress}
                            style={StyleSheet.absoluteFill}
                        >
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon
                                    name="close-outline"
                                    size={24}
                                    color={Colors.light.background}
                                />
                            </View>
                        </Pressable>
                    </Animated.View>
                )}
                <Animated.View
                    style={[styles.listItemLeft, {transform: [{translateX: animations[item.id] || new Animated.Value(0)}]}]}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemDate}>{item.date}</Text>
                </Animated.View>
            </View>
        </Pressable>
    );

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                <Header 
                    header={"Shopping Lists"} 
                    backButton={false} 
                    backLink={""}
                    noProfile={false}
                />
                    <View style={{...globalStyles.searchBar, ...{borderColor: Colors.light.primaryColor}}}>
                        <Icon name="search-outline" size={20} color={Colors.light.primaryColor}
                              style={styles.searchIcon}/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={Colors.light.secondaryText}
                            value={searchQuery}
                            onChangeText={(text) => dispatch(setSearchQuery(text))}
                        />
                    </View>
                    <FlatList
                        data={shoppingLists}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />
                    <Pressable style={styles.addButton} onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Icon name="add" size={24} color={Colors.light.background}/>
                    </Pressable>
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => closeModal()}
                    >
                        <TouchableWithoutFeedback onPress={dismissModal}>
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                                  style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Add New Shopping List</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Name"
                                        value={newItem}
                                        onChangeText={handleTitleChange}
                                        onEndEditing={handleAddList}
                                        autoFocus
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </Modal>
                </SafeAreaView>
                <Footer/>
            </View>
        </TouchableWithoutFeedback>
    );
}

