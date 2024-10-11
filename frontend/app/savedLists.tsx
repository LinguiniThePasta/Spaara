import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity} from "react-native";
import React, {useEffect} from "react";
import {Stack, useRouter, Link, Href} from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from "@/components/config";


import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import TabsFooter from '@/components/TabsFooter';
import AsyncStorage from "@react-native-async-storage/async-storage";

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');
const deleteIcon = require('@/assets/images/DeleteIcon.png');
const openIcon = require('@/assets/images/OpenIcon.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");


//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function SavedListsScreen() {
    //const pushLogin = () => router.push("/login")
    const pushLogin = () => alert("Log in");

    const [shoppingLists, setShoppingLists] = React.useState([
        /*{ name: 'Weekly List' },
        { name: 'Dessert Run' },
        { name: 'Diet Trip' },
        { name: 'GIBBBAAAAAAAAH' },*/
    ]);
    const [newElementName, setNewElementName] = React.useState('Hehe');

    const getAllShoppingLists = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/shopping/get`, // Adjust the URL based on your API
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                    },
                }
            );

            setShoppingLists(response.data);
        } catch (error) {
            console.error('Error retrieving shopping lists:', error);
            alert('Error retrieving shopping lists');
        }
    };
    useEffect(() => {
        // Call the function to load shopping lists when the component mounts
        getAllShoppingLists();
    }, []); // Empty dependency array ensures this runs only on component mount

    const [deletedList, setDeletedList] = React.useState();

    const removeShoppingList = async (index) => {
            try {
                //const updatedElements = shoppingLists.filter((_, i) => i === index);
                //const deletedList = shoppingLists[index];
                //setDeletedList(shoppingLists[index])
                console.log("Deleting this List: ", shoppingLists[index].id);
                console.log(await SecureStore.getItemAsync('jwtToken'));
                const response = await fetch(`${API_BASE_URL}/api/shopping/delete?id=${shoppingLists[index].id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('jwtToken')}`
                    },
                });
                removeElement(index);

                //setShoppingLists(response.data);
            } catch
                (error) {
                console.error('Error deleting shopping lists:', error);
                alert('Error deleting shopping lists');
            }
        }
    ;


    const addElement = () => {
        if (newElementName) {
            setShoppingLists([...shoppingLists, {name: newElementName}]);
            setNewElementName('Hehe');
            //setNewItemQuantity('');
        }
    };

    const removeElement = (index) => {
        const updatedElements = shoppingLists.filter((_, i) => i !== index);
        console.log("Deleting this List: ", shoppingLists[index].id)
        setShoppingLists(updatedElements);
    };

    /*const toggleCheckbox = (index) => {
      const updatedItems = shoppingLists.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );
      setElements(updatedItems);
    };*/

    return (
        <View style={savedListsStyles.container}>

            <View style={savedListsStyles.headerContainer}>
                {/*<NavigationButton label="Back" type="back" destination="/welcome"/>*/}
                <View style={savedListsStyles.headerSpacer}/>
                <Text style={savedListsStyles.headerLabel}>My Grocery Lists</Text>
                <View style={savedListsStyles.headerSpacer}/>
            </View>

            <ScrollView contentContainerStyle={savedListsStyles.itemListContainer}>
                {shoppingLists.map((element, index) => (
                    <View key={index} style={savedListsStyles.itemContainer}>
                        {/*<TouchableOpacity style={savedListsStyles.itemButton}>
              <Text style={savedListsStyles.itemText}>{element.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={savedListsStyles.removeButton} onPress={() => removeElement(index)}>
              <Text style={savedListsStyles.removeButtonText}>Remove</Text>
            </TouchableOpacity>*/}

                        <Text style={savedListsStyles.itemText}>{element.name}</Text>
                        <View style={savedListsStyles.itemButtonsContainer}>
                            {/*<NavigationButton label="tab" type="tab" destination={"/savedLists"}/>
                <NavigationButton label="tab" type="tab" destination={"/savedLists"}/>*/}
                            <View style={savedListsStyles.itemButtonContainer}>
                                <TouchableOpacity style={savedListsStyles.itemButton} onPress={() => addElement()}>
                                    <Image style={savedListsStyles.itemButtonIcon} source={openIcon}/>
                                </TouchableOpacity>
                            </View>
                            <View style={savedListsStyles.itemButtonContainer}>
                                <TouchableOpacity style={savedListsStyles.itemButton}
                                                  onPress={() => removeShoppingList(index)}>
                                    <Image style={savedListsStyles.itemButtonIcon} source={deleteIcon}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                ))}
            </ScrollView>

            <TabsFooter/>

            <StatusBar style='auto'/>
        </View>
    );
}


const savedListsStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFBEE',
        alignItems: 'center',
    },

    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 100,
        backgroundColor: '#F6AA1C',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerLabel: {
        width: 290,
        marginTop: 50,
        marginBottom: 10,
        color: '#232528',
        fontSize: 28,
        textAlign: 'center',
    },

    headerSpacer: {
        width: 50,
        height: 50,
        marginTop: 50,
        marginBottom: 10,
    },

    /*contentContainer: {
      //flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 30,
    },*/

    itemListContainer: {
        //paddingBottom: 16,
        //height: 45,
        //width: 325,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30,
    },

    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F6AA1C',
        //padding: 10,
        height: 45,
        width: 325,
        borderRadius: 15,
        marginBottom: 10,
    },

    /*itemButton: {
      flex: 1,
      backgroundColor: '#b0b0b0',
      borderRadius: 8,
      padding: 8,
    },*/

    itemText: {
        color: '#232528',
        textAlign: 'left',
        fontSize: 20,
        marginHorizontal: 15,
    },

    itemButtonsContainer: {
        flexDirection: 'row',
    },

    itemButtonContainer: {
        height: 45,
        width: 45,
        //height: 50,
        //marginTop: 10,
        //marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    itemButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    itemButtonIcon: {
        width: 25,
        height: 25,
    },

    /*quantityButton: {
      backgroundColor: '#999',
      borderRadius: 8,
      padding: 8,
      marginLeft: 8,
    },

    quantityText: {
      color: '#fff',
    },

    checkbox: {
      flex: 1,
      padding: 10,
    },

    removeButton: {
      backgroundColor: '#ff4d4d',
      borderRadius: 8,
      padding: 8,
      marginLeft: 8,
    },

    removeButtonText: {
      color: '#fff',
    },*/

});
