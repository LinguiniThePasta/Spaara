import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import {Colors} from "@/styles/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {useSelector} from "react-redux";

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
 * @example 
 * <CheckItem item={{ id: 1, title: 'Milk', price: 3.99, quantity: 2 }}></CheckItem>
 * 
 * @returns None
 */

export function CheckItem({item, handleFavoriteItem, handleRemoveItem}) {
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
            marginLeft:10,
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
            padding: 3,
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
    });

    const [number, setNumber] = useState(item.quantity);
    const [favorite, setFavorite] = useState(item.favorited);
    const [checked, setChecked] = useState(item.checked);

    function increaseItem() {
        setNumber(number + 1);
    }

    function decreaseItem() {
        setNumber(number - 1);
        if (number === 0) {
            handleRemoveItem(item);
        }
    }

    function toggleCheck() {
        setChecked(!checked);
    }

    function toggleFavorite() {
        setFavorite(!favorite);
        handleFavoriteItem(item);
    }


    return (
        <View style={styles.item}>    
            <View style={styles.leftContainer}>
                <Pressable onPress={toggleCheck}>
                    <Icon name={checked ? "checkmark-circle" : "ellipse-outline"} size={24} color={checked ? Colors.light.primaryColor : Colors.light.secondaryText} style={styles.checkboxIcon}/>
                </Pressable>
                <Text style={styles.itemText}>{item.title}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Pressable onPress={toggleFavorite/*() => {handleFavoriteItem(item, 10); setFavorite(!favorite);}*/}>
                    <Icon 
                        name={favorite ? "star" : "star-outline" }
                        size={20} 
                        color={favorite ? Colors.light.primaryColor : Colors.light.secondaryText} 
                        style={styles.checkboxText}
                    />
                </Pressable>
                <View style={styles.plusMinusContainer}>
                    <Pressable onPress={(item) => {number - 1 === 0 ? handleRemoveItem(item) : decreaseItem()}}>
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
};



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
            marginLeft:10,
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
            padding: 3,
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
            marginLeft:10,
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
            padding: 3,
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
    });

    return (
        <View style={styles.item}>    
            <View style={styles.leftContainer}>
                <Pressable>
                    <Icon name={"remove-outline"} size={24} color={Colors.light.secondaryText} style={styles.checkboxIcon}/>
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

export function InputItem({initialText, onChangeText, handleAddItem}) {
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
            marginLeft:10,
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
            padding: 3,
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
    });

    const [number, setNumber] = useState(0);
    //const [initialText, setInitialText] = useState("");
    return (
        <View style={styles.item}>
            
            <View style={styles.leftContainer}>
                <Pressable >
                    <Icon name="ellipse-outline" size={30} color={Colors.light.background} style={styles.checkboxText}/>
                </Pressable>
                <TextInput 
                    style={styles.itemText}
                    placeholder='Add Item'
                    placeholderTextColor={Colors.light.secondaryText}
                    editable={true}
                    defaultValue={initialText}
                    onChangeText={(text) => onChangeText(text)}
                    onSubmitEditing={() => handleAddItem()}
                    
                />
            </View>
        </View>
    );
}


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
            marginLeft:10,
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
            padding: 3,
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

