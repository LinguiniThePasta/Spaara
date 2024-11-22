import React from 'react';
import { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert, ScrollView, FlatList} from 'react-native';
//import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector, useDispatch} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileColorItem from '@/components/ProfileColorItem';
import ColorSchemesItem from '@/components/ColorSchemesItem';
import { setBackground, setPrimaryColor } from '@/store/colorScheme';
//import { useDispatch, useSelector } from 'react-redux';

export default function ColorSchemesScreen() {

    const dispatch = useDispatch();
    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.light.background,
            justifyContent: 'space-between',
        },
        listContainer: {
        },
        row: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
        },
        content: {
            flex: 1,
            marginHorizontal: 20,
            justifyContent: "space-between"
        },
        optionText: {
            fontSize: 18,
            fontWeight: "bold",
            color: Colors.light.primaryText,
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
    });

    const [selectedBackground, setSelectedBackground] = useState("lightMode");
    const [selectedPrimaryColor, setSelectedPrimaryColor] = useState("lightMode");

    // Angel, Berry, Cherry, Chocolate, Earth, Lavender, Pastel, Salmon, Sky, Valentine
    const [themeList, setThemeList] = useState([
        {name: "lightMode", selected: false, id: '0'},
        {name: "darkMode", selected: false, id: '1'},
        {name: "angel", selected: false, id: '2'},
        {name: "berry", selected: false, id: '3'},
        {name: "cherry", selected: false, id: '4'},
        {name: "chocolate", selected: false, id: '5'},
        {name: "earth", selected: false, id: '6'},
        {name: "lavender", selected: false, id: '7'},
        {name: "pastel", selected: false, id: '8'},
        {name: "salmon", selected: false, id: '9'},
        {name: "sky", selected: false, id: '10'},
        {name: "valentine", selected: false, id: '11'},
    ]);

    const [selectedTheme, setSelectedTheme] = useState("lightMode");

    useEffect(() => {
        fetchThemeInfo();
    }, []);
    
    const fetchThemeInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/theme_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setSelectedBackground(response.data.background);
            setSelectedPrimaryColor(response.data.primaryColor);
            const newThemeList = themeList.map((currentTheme) => ({
                ...currentTheme,
                selected: (currentTheme.name === response.data.background),
            }));
            setThemeList(newThemeList);
            console.log("Fetched theme info! background: " + response.data.background + "   primaryColor: " + response.data.primaryColor);

        } catch (error) {
            console.error('Error fetching theme info:', error);
        }
    };
    

    
    const updateThemeInfo = async (backgroundTheme, primaryColorTheme) => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            await axios.post(
                `${API_BASE_URL}/api/user/theme_info`, {
                    background: backgroundTheme,
                    primaryColor: primaryColorTheme
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });
                console.log("Updated theme info! background: " + backgroundTheme + "   primaryColor: " + primaryColorTheme);
                //Colors.light.background = backgroundTheme;
                //Colors.light.primaryColor = primaryColorTheme;
                setSelectedBackground(backgroundTheme);
                setSelectedPrimaryColor(primaryColorTheme);
                dispatch(setBackground(backgroundTheme));
                dispatch(setPrimaryColor(primaryColorTheme));
        } catch (error) {
            console.error('Error updating theme info:', error);
        }
    };
    


    const handleThemeSelected = async (colorTheme) => {
        console.log("SELECTED: " + colorTheme.name);
        setSelectedTheme(colorTheme.name);

        const newThemeList = themeList.map((currentTheme) => ({
            ...currentTheme,
            selected: (currentTheme.name === colorTheme.name),
        }));
        setThemeList(newThemeList);

        updateThemeInfo(colorTheme.name, colorTheme.name);
    }


    const renderTheme = ({item}) => {
        return (
            <ColorSchemesItem colorTheme={item} handleThemeSelected={handleThemeSelected}/>
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            <Header header="Set App Theme"
                    backButton={true}
                    backLink={"themes"}
                    noProfile={false}
            />
                <View style={styles.content}>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={themeList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderTheme}
                            numColumns={4}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            <Footer/>
        </SafeAreaView>
    );
}
