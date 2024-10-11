


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter, Link, Href, router } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';
import NavigationButton from '@/components/NavigationButton';
import TabsFooter from '@/components/TabsFooter';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');
const deleteIcon = require('@/assets/images/DeleteIcon.png');
const openIcon = require('@/assets/images/OpenIcon.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function SavedRecipesScreen() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("Log in");

  const [elements, setElements] = React.useState([
    { name: 'Beefaroni' },
    { name: 'Apple Pie' },
    { name: 'Smallga' },
    { name: 'Bigitte' },
  ]);
  const [newElementName, setNewElementName] = React.useState('Hehe');
  //const [newElementQuantity, setNewItemQuantity] = React.useState('');

  const addElement = () => {
    if (newElementName) {
      setElements([...elements, { name: newElementName }]);
      setNewElementName('Hehe');
      //setNewItemQuantity('');
    }
  };

  const removeElement = (index) => {
    const updatedElements = elements.filter((_, i) => i !== index);
    setElements(updatedElements);
  };

  /*const toggleCheckbox = (index) => {
    const updatedItems = elements.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setElements(updatedItems);
  };*/

  return (
    <View style={savedListsStyles.container}>

        <View style={savedListsStyles.headerContainer}>
          {/*<NavigationButton label="Back" type="back" destination="/welcome"/>*/}
          <View style={savedListsStyles.headerSpacer}/>
          <Text style={savedListsStyles.headerLabel}>My Recipes</Text>
          <View style={savedListsStyles.headerSpacer}/>
        </View>

        <Button label="View Favorite Items" theme="primary-wide" onPress={() => {router.replace("/favoritedItems")}}/>

        <ScrollView contentContainerStyle={savedListsStyles.itemListContainer}>
        {elements.map((element, index) => (
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
                    <TouchableOpacity style={savedListsStyles.itemButton} onPress={() => removeElement(index)}>
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

  itemListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6AA1C',
    height: 45,
    width: 325,
    borderRadius: 15,
    marginBottom: 10,
  },

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

});