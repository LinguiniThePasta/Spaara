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
import {useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileIconItem from '@/components/ProfileIconItem';

export default function ProfileIconsScreen() {

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
    

    const [iconList, setIconList] = useState([
        {name: "person", selected: false, id: '0'},
        {name: "star", selected: false, id: '1'},
        {name: "heart", selected: false, id: '2'},
        {name: "cart", selected: false, id: '3'},
        {name: "game-controller", selected: false, id: '4'},
        {name: "rocket", selected: false, id: '5'},
        {name: "restaurant", selected: false, id: '6'},
        {name: "fish", selected: false, id: '7'},
        {name: "earth", selected: false, id: '8'},
        {name: "bulb", selected: false, id: '9'},
        {name: "leaf", selected: false, id: '10'},
        {name: "musical-notes", selected: false, id: '11'},
        {name: "paw", selected: false, id: '12'},
        {name: "flash", selected: false, id: '13'},
        {name: "glasses", selected: false, id: '14'},
        {name: "trophy", selected: false, id: '15'},
        {name: "snow", selected: false, id: '16'},
        {name: "thumbs-up", selected: false, id: '17'},
        {name: "happy", selected: false, id: '18'},
        {name: "pizza", selected: false, id: '19'},
        {name: "planet", selected: false, id: '20'},
        {name: "beer", selected: false, id: '21'},
        {name: "nutrition", selected: false, id: '22'},
        {name: "dice", selected: false, id: '23'},
        {name: "trash", selected: false, id: '24'},
        {name: "ice-cream", selected: false, id: '25'},
        {name: "american-football", selected: false, id: '26'},
        {name: "hand-right", selected: false, id: '27'},
    ]);

    const [selectedIcon, setSelectedIcon] = useState("person");
    const [selectedColor, setSelectedColor] = useState(Colors.light.background);

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            const response = await axios.get(
                `${API_BASE_URL}/api/user/profile_info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

            setSelectedIcon(response.data.icon);
            setSelectedColor(response.data.color);
            const newIconList = iconList.map((currentIcon) => ({
                ...currentIcon,
                selected: (currentIcon.name === response.data.icon),
            }));
            setIconList(newIconList);
            console.log("Fetched profile info! color: " + response.data.color + "   icon: " + response.data.icon);

        } catch (error) {
            console.error('Error fetching profile info:', error);
        }
    };

    const updateProfileInfo = async (iconName) => {
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            await axios.post(
                `${API_BASE_URL}/api/user/profile_info`, {
                    icon: iconName,
                    color: selectedColor
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });
                console.log("Updated profile info! color: " + selectedColor + "   icon: " + iconName);
        } catch (error) {
            console.error('Error updating profile info:', error);
        }
    };



    const handleIconSelected = async (icon) => {
        console.log("SELECTED: " + icon.name);
        setSelectedIcon(icon.name);

        const newIconList = iconList.map((currentIcon) => ({
            ...currentIcon,
            selected: (currentIcon.name === icon.name),
        }));
        setIconList(newIconList);

        updateProfileInfo(icon.name);
    };


    const renderIcon = ({item}) => {
        return (
            <ProfileIconItem icon={item} iconColor={selectedColor} handleIconSelected={handleIconSelected}/>
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            <Header header="Set Profile Icon"
                    backButton={true}
                    backLink={"themes"}
                    noProfile={false}
            />
                <View style={styles.content}>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={iconList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderIcon}
                            numColumns={4}
                        />
                    </View>
                </View>
            <Footer/>
        </SafeAreaView>
    );
}

