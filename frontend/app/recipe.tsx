import React, {useState, useEffect, useRef, Children} from 'react';
import {
    Keyboard,
    Animated,
    TouchableWithoutFeedback,
    Alert,
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Modal,
    PanResponder,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_BASE_URL} from '@/scripts/config';
import {Link, router} from 'expo-router';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import shortenTime from "@/scripts/shortenTime";

export default function Recipe() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [friends, setFriends] = useState([]);
    const [newItem, setNewItem] = useState({title: ''});
    const [modalVisible, setModalVisible] = useState(false);
    const [friendVisable, setFriendVisable] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [animations, setAnimations] = useState({});


    // Tested code actually pulls lists correctly from backend, but is commented out for now until we fix login
    useEffect(() => {
        fetchRecipes();
        fetchFriends();
    }, []);

    const dismissModal = () => {
        Keyboard.dismiss(); // Dismiss keyboard if open
        setModalVisible(false); // Close the modal
    };

    const fetchRecipes = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/recipe/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            const lists = response.data.map(item => ({
                id: item.id.toString(),
                title: item.name,
                date: shortenTime(item.update_time)
            }));

            // Initialize animations for each list item
            lists.forEach(list => {
                animations[list.id] = new Animated.Value(0);
            });

            console.log("Correctly fetched recipes!");
            setRecipes(lists);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    const handleAddList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(`${API_BASE_URL}/api/recipe/`, {
                name: newItem.title,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                }
            });

            // Refresh the shopping lists after adding a new one
            await fetchRecipes();
            // Close modal
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding new shopping list:', error);
        }
    };

    const handleDeleteList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.delete(`${API_BASE_URL}/api/recipe/${selectedList.id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });

            // Refresh the shopping lists after deleting one
            fetchRecipes();
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
            setEditedTitle(list.title);
            // Start the animation for the newly selected list
            Animated.timing(animations[list.id], {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleTitleChange = (text) => {
        setNewItem({...newItem, title: text});
    };

    const handleRename = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.put(`${API_BASE_URL}/api/recipe/${selectedList.id}/`,
                {
                    name: `${editedTitle}`
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });

            // Refresh the shopping lists after deleting one
            fetchRecipes();
        } catch (error) {
            console.error('Error updating name:', error);
        }

        setRecipes(recipes.map(list =>
            list.id === selectedList.id ? {...list, title: editedTitle} : list
        ));
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
                {text: "Delete", onPress: handleDeleteList}
            ],
            {cancelable: false}
        );
    };

    const handleDelete = () => {
        setRecipes(recipes.filter(list => list.id !== selectedList.id));
        setShowDeleteOptions(false);
        Animated.timing(animations[selectedList.id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
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

    const handleShare = async (item) => {
        setSelectedRecipe(item)
    }

    const renderItem = ({item}) => (
        <SwipeableItem handleShare={handleShare(item)}>
            <Pressable
                onPress={() => router.replace(`/modifyrecipe?id=${item.id}&title=${encodeURIComponent(item.title)}&date=${item.date}`)}
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
                                style={StyleSheet.absoluteFill} // Fills the entire red area
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
        </SwipeableItem>
    );

    const renderFriends = ({item}) => {
        return (
            <View style={styles.container} >
                <TouchableOpacity style={styles.listItem} onPress={() => sendRecipe(item)}>
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const fetchFriends = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
    
            const response = await axios.get(`${API_BASE_URL}/api/user/friends`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
    
            const users = response.data.map((item) => ({
                id: item.id.toString(),
                name: item.username,
            }));
    
            setFriends(users);
            console.log('Correctly fetched friends!');
        } catch (error) {
            console.error('Error fetching friends:', error.message);
        }
    };

    const SwipeableItem = ({children, handleShare}) => {
        const translateX = useRef(new Animated.Value(0)).current;
        
        const panResponder = useRef(
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderMove: (_, gestureState) => {
                    if (gestureState.dx < 0) {
                    translateX.setValue(gestureState.dx);
                    }
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dx > 100) {
                    // Fully reveal the button if swiped far enough
                    Animated.timing(translateX, {
                        toValue: 100,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    } else {
                    // Snap back to original position
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    }
                },
            })
        ).current;
        
        return (
            <View style={styles.container}>
                <View style={styles.hiddenButton}>
                    <TouchableOpacity style={styles.shareButton} onPress={() => {
                        setFriendVisable(true);
                        handleShare;
                        }}>
                        <Icon name="arrow-redo-outline" size={20}></Icon>
                    </TouchableOpacity>
                </View>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                    styles.container,
                    {
                        transform: [{ translateX }],
                    },
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        );
    };

    const sendRecipe = async (item) => {

    };


    const insets = useSafeAreaInsets();

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={styles.container}>
                <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
                    <Header header={"Recipes"}/>
                    <View style={globalStyles.searchBar}>
                        <Icon name="search-outline" size={20} color={Colors.light.primaryColor}
                              style={styles.searchIcon}/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={Colors.light.secondaryText}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <FlatList
                        data={recipes}
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
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={dismissModal}>
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                                  style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        {/*<Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>*/}
                                        {/*    <Icon name="close" size={24} color={Colors.light.primaryText}/>*/}
                                        {/*</Pressable>*/}
                                        <Text style={styles.modalTitle}>Add New Recipe</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Name"
                                        value={newItem.title}
                                        onChangeText={handleTitleChange}
                                        onEndEditing={handleAddList}
                                        autoFocus
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <Footer/>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={friendVisable}
                    onRequestClose={() => setFriendVisable(false)}
                >
                    <View style={styles.friendContainer}>
                        <View style={styles.friendContent}>
                            <Pressable style={styles.closeButton} onPress={() => setFriendVisable(false)}>
                                <Icon name="close-outline" size={40} color={Colors.light.primaryText}/>
                            </Pressable>

                            {/* Remove text inputs */}
                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.listContainer}
                                renderItem={renderFriends}
                            />

                        </View>
                    </View>
                </Modal>
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
    shareButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        
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
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    closeButton: {
        marginRight: 30,
        marginBottom: 20
    },
    hiddenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: Colors.light.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderColor: Colors.light.primaryColor,
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
    item: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        zIndex: 1,
    },
    friendContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    friendContent: {
        backgroundColor: Colors.light.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '50%',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }

});