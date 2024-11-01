import React, {useState, useEffect} from 'react';
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
    Modal
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {CheckItem, InputItem} from '@/components/Item';
//import { ListAccordion } from 'react-native-paper/lib/typescript/components/List';
//import { Accordion } from 'react-native-paper/lib/typescript/components/List/List';
import { List } from 'react-native-paper'
//import Recipe from './recipe';
//import { setSearchQuery } from '../store/shoppingListSlice';





export function ItemGroup({name, items, handleFavoriteItem, handleRemoveItem, onChangeText, handleAddItem}) {

    const renderItem = ({item}) => {
        const isInput = (item.id === -1);
        return (
            <View>
                {isInput === false ? (
                    <CheckItem item={item} handleFavoriteItem={handleFavoriteItem} handleRemoveItem={handleRemoveItem}></CheckItem>
                ) : (
                    <InputItem onChangeText={onChangeText} handleAddItem={handleAddItem}></InputItem>
                )}
            </View>
        );
    };

    const [expanded, setExpanded] = React.useState(true);
    const handleAccordionPress = () => setExpanded(!expanded);

    return (
        <View style={styles.container}>
            <View style={styles.itemGroupContainer}>
                <List.Accordion
                    style={styles.itemGroupTitle}
                    titleStyle={styles.itemGroupTitle}
                    title={name}
                    expanded={expanded}
                    onPress={handleAccordionPress}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />
                </List.Accordion>
            </View>
        </View>
    );
};





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
    itemGroupContainer: {
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: Colors.light.primaryColor,
    },
    itemGroupTitle: {
        backgroundColor: Colors.light.background,
        color: Colors.light.primaryText,
        fontSize: 24,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
    },
    itemLeftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTextContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    itemTitle: {
        fontSize: 18,
    },
    itemInfoContainer: {
        flexDirection: 'row',
    },
    itemPrice: {
        fontSize: 14,
    },
    itemIconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
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
        color: Colors.light.background,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '50%',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    modalTitle: {
        fontSize: 24,
        top: 5,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    closeButton: {
        color: 'black',
    },
    closeButtonText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
    },
    modalButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: Colors.light.background,
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
        marginRight: 20,
        marginLeft: 10,
        marginTop: 20,
    },
    selectedButton: {
        backgroundColor: Colors.light.primaryColor,
        padding: 10
    },
    unselectedButton: {
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.primaryColor,
        borderWidth: 2,
        padding: 8
    },
    selectedText: {
        fontSize: 16,
        color: Colors.light.primaryText,
    },
    favoriteHeaderText: {
        fontSize: 28,
        color: Colors.light.primaryText,
        marginLeft: 10,
        marginTop: 15,
    },
    flatList: {
        marginLeft: 10,
    },
    recipeContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recipeLeft: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    recipeRight: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        flexDirection: 'row',
    },
    plusButton: {
        borderWidth: 2,
        borderColor: Colors.light.secondaryText,
    },

});