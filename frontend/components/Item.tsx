import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import {Colors} from "@/styles/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {useSelector} from "react-redux";
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config";
import * as SecureStore from "expo-secure-store";

/**
 * CheckItem Component
 *
 * Renders a single item with interactive controls, such as quantity adjustment,
 * checkbox-like selection, and a favorite icon. This component displays the
 * item's name and allows users to increment or decrement its quantity.
 *
 * @param item the Item you want to display
 * @param handleFavoriteItem the function to add an item to favorited
 * @param handleRemoveItem the function to remove an item when the quantity is 0
 *
 * @param handleModifyItem
 * @example
 * <CheckItem item={{ id: 1, title: 'Milk', price: 3.99, quantity: 2 }}></CheckItem>
 *
 * @returns None
 */

export function CheckItem({item, handleRemoveItem, callingFrom}) {
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        item: {
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
        },
        plusMinusContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 50,
            borderColor: Colors.light.secondaryText,
            padding: 1,
            marginLeft: 10,
        },
        divider: {
            width: 2,
            height: '100%',
            backgroundColor: Colors.light.secondaryText,
            borderColor: Colors.light.secondaryText,
            color: Colors.light.secondaryText,

        },
        itemText: {
            color: Colors.light.primaryText,
            fontSize: 21,
        },
        addItemText: {
            //color: 'gray',
            color: Colors.light.secondaryText,
            fontStyle: 'italic',
            fontSize: 18,
        },
        checkboxIcon: {
            marginRight: 5,
            fontSize: 25,
        },
        checkboxText: {
            fontSize: 25,
        },
        rightContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',

        },
        leftContainer: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '50%',
            padding: 3,
        },
        priceText: {
            fontSize: 16,
            marginRight: 10,
            color: Colors.light.primaryText,
        },
        favoriteButton: {
            fontSize: 25,
        },
        isFavorite: {
            color: Colors.light.primaryColor,
        },
        notFavorite: {
            color: Colors.light.secondaryText,
        },
        notesContainer: {
            marginTop: 5,
        },

    });

    const [number, setNumber] = useState(item.quantity);
    const [favorite, setFavorite] = useState(!!item.favorited);
    const [checked, setChecked] = useState(item.checked);
    const [note, setNote] = useState(item.notes || "");
    const [isEditing, setIsEditing] = useState(false);
    const price = item.price !== undefined && item.price !== null ? item.price : 0.00; // Default price if not provided


    const increaseItem = async () => {
        const newNumber = number + 1;
        setNumber(newNumber);
        item.quantity = newNumber;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.patch(`${API_BASE_URL}/api/${callingFrom}/${item.id}/`,
                {
                    quantity: item.quantity,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
        } catch (error) {
            setNumber(newNumber - 1);
            item.quantity = newNumber - 1;
        }
    }

    const decreaseItem = async () => {
        const newNumber = number - 1;
        setNumber(newNumber);
        item.quantity = newNumber;
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.patch(`${API_BASE_URL}/api/${callingFrom}/${item.id}/`,
                {
                    quantity: item.quantity,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
        } catch (error) {
            setNumber(newNumber + 1);
            item.quantity = newNumber + 1;
        }

        if (newNumber === 0) {
            handleRemoveItem(item);
        }
    }

    const toggleCheck = async () => {
        console.log("HEYYYYY");
        console.log(checked);
        setChecked(!checked);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            console.log(callingFrom);
            const response = await axios.post(`${API_BASE_URL}/api/${callingFrom}/${item.id}/check/`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
        } catch (error) {
            console.log("Could not set check status, rolling back... Error:", error);
            setChecked(!checked);
        }
    }

    const toggleFavorite = async () => {
        setFavorite(!favorite);
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            console.log(callingFrom);
            const response = await axios.post(`${API_BASE_URL}/api/${callingFrom}/${item.id}/favorite/`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
        } catch (error) {
            console.log("Could not set favorites, rolling back... Error:", error);
            setFavorite(!favorite);
        }
    }

    async function onNoteChange(note) {
        setNote(note);
        item.notes = note;
        try {
            // await handleModifyItem(item);
            console.log("handleModifyItem successfully called");
        } catch (error) {
            console.error("Error in handleModifyItem:", error);
        }
    }

    function handleDeleteNote() {
        setNote("");
        item.notes = "";
        // handleModifyItem(item);
    }

    return (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <Pressable onPress={toggleCheck}>

                    <Icon
                        name={checked ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={checked ? Colors.light.primaryColor : Colors.light.secondaryText}
                        style={styles.checkboxIcon}
                    />
                </Pressable>
                <Text style={styles.itemText}>{item.name}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Text style={styles.priceText}>${price}</Text>
                <Pressable onPress={toggleFavorite}>
                    <Icon
                        name={!!favorite ? "star" : "star-outline"}
                        size={20}
                        color={!!favorite ? Colors.light.primaryColor : Colors.light.secondaryText}
                        style={styles.checkboxText}
                    />
                </Pressable>
                <View style={styles.buttonsContainer}>
                    <Pressable onPress={() => setIsEditing(true)} style={styles.button}>
                        <Icon name="pencil-outline"></Icon>
                    </Pressable>
                    <Pressable onPress={handleDeleteNote} style={styles.button}>
                        <Icon name="trash-outline"></Icon>
                    </Pressable>
                </View>
                <View style={styles.plusMinusContainer}>
                    <Pressable onPress={() => {
                        number - 1 === 0 ? handleRemoveItem(item) : decreaseItem();
                    }}>
                        <Icon name="remove-outline" size={20} color={Colors.light.primaryText} style={styles.itemText}/>
                    </Pressable>
                    <View style={styles.divider}></View>
                    <Text style={styles.itemText}>{number}</Text>
                    <View style={styles.divider}></View>
                    <Pressable onPress={increaseItem}>
                        <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.itemText}/>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}


export function SpacerItem() {
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        item: {
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
        },
        plusMinusContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 50,
            borderColor: Colors.light.secondaryText,
            padding: 1,
            marginLeft: 10,
        },
        divider: {
            width: 2,
            height: '100%',
            backgroundColor: Colors.light.secondaryText,
            borderColor: Colors.light.secondaryText,
            color: Colors.light.secondaryText,

        },
        itemText: {
            color: Colors.light.primaryText,
            fontSize: 21,
        },
        addItemText: {
            //color: 'gray',
            color: Colors.light.secondaryText,
            fontStyle: 'italic',
            fontSize: 18,
        },
        checkboxIcon: {
            marginRight: 5,
            fontSize: 25,
        },
        checkboxText: {
            fontSize: 25,
        },
        rightContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',

        },
        leftContainer: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '50%',
            padding: 3,
        },
        priceText: {
            fontSize: 16,
            marginRight: 10,
            color: Colors.light.primaryText,
        },
        favoriteButton: {
            fontSize: 25,
        },
        isFavorite: {
            color: Colors.light.primaryColor,
        },
        notFavorite: {
            color: Colors.light.secondaryText,
        },
        notesContainer: {
            marginTop: 5,
        },

    });

    return (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <Pressable>
                    <Icon name={"ellipse"} size={24} color={Colors.light.background} style={styles.checkboxIcon}/>
                </Pressable>
                <Text style={styles.itemText}></Text>
            </View>
        </View>
    );
};


export function RecipeItem({item}) {
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        item: {
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
        },
        plusMinusContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 50,
            borderColor: Colors.light.secondaryText,
            padding: 1,
            marginLeft: 10,
        },
        divider: {
            width: 2,
            height: '100%',
            backgroundColor: Colors.light.secondaryText,
            borderColor: Colors.light.secondaryText,
            color: Colors.light.secondaryText,

        },
        itemText: {
            color: Colors.light.primaryText,
            fontSize: 21,
        },
        addItemText: {
            //color: 'gray',
            color: Colors.light.secondaryText,
            fontStyle: 'italic',
            fontSize: 18,
        },
        checkboxIcon: {
            marginRight: 5,
            fontSize: 25,
        },
        checkboxText: {
            fontSize: 25,
        },
        rightContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',

        },
        leftContainer: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '50%',
            padding: 3,
        },
        priceText: {
            fontSize: 16,
            marginRight: 10,
            color: Colors.light.primaryText,
        },
        favoriteButton: {
            fontSize: 25,
        },
        isFavorite: {
            color: Colors.light.primaryColor,
        },
        notFavorite: {
            color: Colors.light.secondaryText,
        },
        notesContainer: {
            marginTop: 5,
        },

    });

    return (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <Pressable>
                    <Icon name={"remove-outline"} size={24} color={Colors.light.secondaryText}
                          style={styles.checkboxIcon}/>
                </Pressable>
                <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <View style={styles.rightContainer}>
            </View>
        </View>
    );
};


/**
 * InputItem Component
 *
 * Renders a single item with an interactable text feild that allows the user to input the name of an item
 * to add it to shopping lists
 *
 * @param onChangeText function to handle name of new item
 * @param handleAddItem functon to handle adding item to list
 *
 * @example
 * <InputItem onChangeText={setNewItemName} handleAddItem={handleAddItem}></InputItem>
 *
 * @returns None
 */

export function InputItem({initialText, handleAddItem}) {
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        item: {
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
        },
        plusMinusContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 50,
            borderColor: Colors.light.secondaryText,
            padding: 1,
            marginLeft: 10,
        },
        divider: {
            width: 2,
            height: '100%',
            backgroundColor: Colors.light.secondaryText,
            borderColor: Colors.light.secondaryText,
            color: Colors.light.secondaryText,

        },
        itemText: {
            color: Colors.light.primaryText,
            fontSize: 21,
            width: "100%"
        },
        addItemText: {
            //color: 'gray',
            color: Colors.light.secondaryText,
            fontStyle: 'italic',
            fontSize: 18,
        },
        checkboxIcon: {
            marginRight: 5,
            fontSize: 25,
        },
        checkboxText: {
            fontSize: 25,
        },
        rightContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',

        },
        leftContainer: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '50%',
            padding: 3,
        },
        priceText: {
            fontSize: 16,
            marginRight: 10,
            color: Colors.light.primaryText,
        },
        favoriteButton: {
            fontSize: 25,
        },
        isFavorite: {
            color: Colors.light.primaryColor,
        },
        notFavorite: {
            color: Colors.light.secondaryText,
        },
        notesContainer: {
            marginTop: 5,
        },

    });

    const [text, setText] = useState(''); // State for the input value

    const handleSubmit = () => {
        if (text.trim() !== '') {
            handleAddItem(text);
            setText('');
        }
    };

    return (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <Pressable>
                    <Icon
                        name="ellipse-outline"
                        size={30}
                        color={Colors.light.background}
                        style={styles.checkboxText}
                    />
                </Pressable>
                <TextInput
                    style={styles.itemText}
                    placeholder={"Add Item"}
                    placeholderTextColor={Colors.light.secondaryText}
                    value={text}
                    onChangeText={(inputText) => setText(inputText)}
                    onSubmitEditing={handleSubmit}
                />
            </View>
        </View>
    );
};


/**
 * FovariteItem Component
 *
 * Renders a single favorited item with controls to add the item to the shopping list
 *
 * @param item The Item you want to display
 * @param addFavoriteItem The function to add favorite item to list
 * @param removeFromFavorite the function to remove favorite item from favorited
 */

export const FavoriteItem = ({item, addFavoriteItem, removeFromFavorite}) => {
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        item: {
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
        },
        plusMinusContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 50,
            borderColor: Colors.light.secondaryText,
            padding: 1,
            marginLeft: 10,
        },
        divider: {
            width: 2,
            height: '100%',
            backgroundColor: Colors.light.secondaryText,
            borderColor: Colors.light.secondaryText,
            color: Colors.light.secondaryText,

        },
        itemText: {
            color: Colors.light.primaryText,
            fontSize: 21,
        },
        addItemText: {
            //color: 'gray',
            color: Colors.light.secondaryText,
            fontStyle: 'italic',
            fontSize: 18,
        },
        checkboxIcon: {
            marginRight: 5,
            fontSize: 25,
        },
        checkboxText: {
            fontSize: 25,
        },
        rightContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',

        },
        leftContainer: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '50%',
            padding: 3,
        },
        priceText: {
            fontSize: 16,
            marginRight: 10,
            color: Colors.light.primaryText,
        },
        favoriteButton: {
            fontSize: 25,
        },
        isFavorite: {
            color: Colors.light.primaryColor,
        },
        notFavorite: {
            color: Colors.light.secondaryText,
        },
        notesContainer: {
            marginTop: 5,
        },

    });

    return (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Pressable onPress={removeFromFavorite}>
                    <Icon name="star" size={20} color={Colors.light.primaryColor} style={styles.checkboxText}/>
                </Pressable>
                <View style={styles.plusMinusContainer}>
                    <Pressable onPress={addFavoriteItem}>
                        <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.itemText}/>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

/*
const styles = StyleSheet.create({
    item: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10,
    },
    plusMinusContainer: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 50,
        borderColor: Colors.light.secondaryText,
        padding: 1,
        marginLeft: 10,
    },
    divider: {
        width: 2,
        height: '100%',
        backgroundColor: Colors.light.secondaryText,
        borderColor: Colors.light.secondaryText,
        color: Colors.light.secondaryText,

    },
    itemText: {
        color: Colors.light.primaryText,
        fontSize: 21,
    },
    addItemText: {
        color: 'gray',
        fontStyle: 'italic',
        fontSize: 18,
    },
    checkboxIcon: {
        marginRight: 5,
        fontSize: 25,
    },
    checkboxText: {
        fontSize: 25,
    },
    rightContainer: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',

    },
    leftContainer: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%',
        padding: 3,
    },
    priceText: {
        fontSize: 16,
        marginRight: 10,
        color: Colors.light.primaryText,
    },
    favoriteButton: {
        fontSize: 25,
    },
    isFavorite: {
        color: Colors.light.primaryColor,
    },
    notFavorite: {
        color: Colors.light.secondaryText,
    },
    notesContainer: {
        marginTop: 5,
    },

});
*/