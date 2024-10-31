import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from "@/styles/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {useSelector} from "react-redux";
import { TextInput } from 'react-native-gesture-handler';


//<Icon name="star-outline" size={20} color={Colors.light.primaryText} style={styles.icon}/> star
//<Icon name="ellipse-outline" size={24} color={Colors.light.secondaryText} style={styles.icon}/> circle

/*
    item parameters

 *  id: item.id.toString(),
    title: item.name,
    price: 0,
    favorited: item.favorited,
    checked: false,
    list: item.list.toString()
*/



/* 
 * this is the basis for what an item with a checkbox should look like
 * this is also the equivilant to unoptimized items
 */

export const CheckItem = ({item}) => {
    const priceText = item.price === 0 ? '' : '$' + item.price;
    const isInput = (item.id === -1);
    const dummyString = "-1";


    const [number, setNumber] = useState(0);
    const [shoppingItems, setShoppingItems] = useState([
        /*{ id: 998, title: 'Ham', price: 3.99, favorited: false, checked: false },
        { id: 999, title: 'Cheese', price: 4.99, favorited: false, checked: false },
        { id: -1, title: '', price: 0, favorited: false, checked: false },*/
    ]);

    function increaseItem() {
        setNumber(number + 1);
    }
    function decreaseItem() {
        setNumber(number - 1);
    }
    return (
        <View style={styles.checkItem}>
            
            <View style={styles.leftContainer}>
                <Pressable >
                    <Icon name="ellipse-outline" size={24} color={Colors.light.secondaryText} style={styles.checkboxText}/>
                </Pressable>
                <Text style={styles.itemText}>{item.title}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Pressable >
                    <Icon name="star-outline" size={20} color={Colors.light.secondaryText} style={styles.checkboxText}/>
                </Pressable>
                <View style={styles.plusMinusContainer}>
                    <Pressable onPress={decreaseItem}>
                        <Icon name="remove-outline" size={20} color={Colors.light.primaryText} style={styles.itemText}/>
                    </Pressable>
                    <View style={styles.divider}></View>
                    <Text style={styles.itemText}>{number}</Text>
                    <Pressable onPress={increaseItem}>
                        <Icon name="add-outline" size={20} color={Colors.light.primaryText} style={styles.itemText}/>                    
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export const inputItem = () => {

}


export const UncheckItem = () => {

};

const styles = StyleSheet.create({
    checkItem: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        fontSize: 20,
    },
    checkboxText: {
        color: Colors.light.secondaryText,
        fontSize: 20,
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
});