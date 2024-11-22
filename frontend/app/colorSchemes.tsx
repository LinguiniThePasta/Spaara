import React from 'react';
import { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet, Alert, ScrollView, FlatList} from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router';
import axios from "axios";
import {API_BASE_URL} from "@/scripts/config"; // Use router for navigation if needed
import * as SecureStore from 'expo-secure-store';
import {useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileColorItem from '@/components/ProfileColorItem';
import ColorSchemesItem from '@/components/ColorSchemesItem';

export default function ColorSchemesScreen() {
    /*
    const [colorList, setColorList] = useState([
        {name: "#FF8FC5", selected: false, id: '0'},
        {name: "#E0474C", selected: false, id: '1'},
        {name: "#D02310", selected: false, id: '2'},
        {name: "#A71100", selected: false, id: '3'},
        {name: "#E44928", selected: false, id: '4'},
        {name: "#FF5500", selected: false, id: '5'},
        {name: "#FB9E74", selected: false, id: '6'},
        {name: "#F6AA1C", selected: false, id: '7'},
        {name: "#EFBF04", selected: false, id: '8'},
        {name: "#FFD900", selected: false, id: '9'},
        {name: "#F4EA3F", selected: false, id: '10'},
        {name: "#DDF308", selected: false, id: '11'},
        {name: "#99C819", selected: false, id: '12'},
        {name: "#32CD32", selected: false, id: '13'},
        {name: "#008000", selected: false, id: '14'},
        {name: "#309C7B", selected: false, id: '15'},
        {name: "#35D0AD", selected: false, id: '16'},
        {name: "#87CDEE", selected: false, id: '17'},
        {name: "#008ECC", selected: false, id: '18'},
        {name: "#0F53BD", selected: false, id: '19'},
        {name: "#8080FF", selected: false, id: '20'},
        {name: "#9966CB", selected: false, id: '21'},
        {name: "#6F2DA8", selected: false, id: '22'},
        {name: "#81007F", selected: false, id: '23'},
        {name: "#D2D2D3", selected: false, id: '24'},
        {name: "#A7A7A7", selected: false, id: '25'},
        {name: "#67676A", selected: false, id: '26'},
        {name: "#232528", selected: false, id: '27'},
    ]);
    */

    //const [selectedColor, setSelectedColor] = useState("#F6AA1C");
    //const [selectedIcon, setSelectedIcon] = useState("");
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

    const [selectedTheme, setSelectedTheme] = useState("light");

    useEffect(() => {
        //fetchProfileInfo();
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
                Colors.light.background = backgroundTheme;
                Colors.light.primaryColor = primaryColorTheme;
        } catch (error) {
            console.error('Error updating theme info:', error);
        }
    };
    



    /*
    const handleColorSelected = async (color) => {
        console.log("SELECTED: " + color.name);
        setSelectedColor(color.name);

        const newColorList = colorList.map((currentColor) => ({
            ...currentColor,
            selected: (currentColor.name === color.name),
        }));
        setColorList(newColorList);

        updateProfileInfo(color.name);
    };
    */

    const handleThemeSelected = async (colorTheme) => {
        console.log("SELECTED: " + colorTheme.name);
        setSelectedTheme(colorTheme.name);

        const newThemeList = themeList.map((currentTheme) => ({
            ...currentTheme,
            selected: (currentTheme.name === colorTheme.name),
        }));
        setThemeList(newThemeList);

        //updateProfileInfo(color.name);
        updateThemeInfo(colorTheme.name, colorTheme.name);
    }


    const renderTheme = ({item}) => {
        return (
            //<ProfileColorItem iconColor={item} iconName={selectedIcon} handleColorSelected={handleColorSelected}/>
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
                        />
                    </View>
                </View>
            <Footer/>
        </SafeAreaView>
    );
}

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
