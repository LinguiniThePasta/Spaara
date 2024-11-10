import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {router} from "expo-router";
import {Colors} from "@/styles/Colors";  // You can use a different icon set if you prefer
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import {setLastAccessedList, setShoppingLists, setSearchQuery} from '../store/shoppingListSlice';
import roleSlice from "@/store/roleSlice";

export default function Footer() {
    const role = useSelector((state) => state.role.role);
    const lastAccessedList = useSelector((state) => state.shoppingList.lastAccessedList);


    const goToLastAccessedList = () => {
        if (lastAccessedList) {
            router.push(`/modifyshopping?id=${lastAccessedList}`);
        } else {
            router.push('/shopping');
        }
    };

    return (
        <View style={styles.footerContainer}>
            {role !== "Guest" && role !== "Visitor" && (
                <Pressable style={styles.footerItem} onPress={() => router.push("/favorite")}>
                    <Icon name="heart-outline" size={24} color="#000"/>
                    <Text style={styles.footerText}>Favorites</Text>
                </Pressable>
            )
            }
            <Pressable style={styles.footerItem} onPress={() => router.push("/map")}>
                <Icon name="location-outline" size={24} color="#000"/>
                <Text style={styles.footerText}>Map</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={() => goToLastAccessedList()}>
                <Icon name="cart-outline" size={24} color="#000"/>
                <Text style={styles.footerText}>List</Text>
            </Pressable>
            {role !== "Guest" && role !== "Visitor" &&
                (
                    <Pressable style={styles.footerItem} onPress={() => router.push("/recipe")}>
                        <Icon name="book-outline" size={24} color="#000"/>
                        <Text style={styles.footerText}>Recipes</Text>
                    </Pressable>
                )
            }
            {role !== "Guest" && role !== "Visitor" && 
                (
                    <Pressable style={styles.footerItem} onPress={() => router.push("/social")}>
                        <Icon name="people-outline" size={24} color="#000"/>
                        <Text style={styles.footerText}>Social</Text>
                    </Pressable>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 0.04 * height,
        paddingTop: 0.03 * height,
        backgroundColor: Colors.light.background,  // Change to match your app's theme
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#000',  // Adjust to match your app's text color
    },
});
