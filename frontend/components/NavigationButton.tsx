


import { StyleSheet, View, Pressable, Image, Text } from 'react-native';
import { Stack, router, Link, Href } from 'expo-router';



const backIcon = require('@/assets/images/BackArrow.png');
const homeIcon = require('@/assets/images/HomeIcon.png');
const listIcon = require('@/assets/images/ListIcon.png');
const mapIcon = require('@/assets/images/MapIcon.png');
const recipeIcon = require('@/assets/images/RecipeIcon.png');
const settingsIcon = require('@/assets/images/SettingsIcon.png');

type props = {
    label: string;
    type: string;
    destination: Href;
}

export default function NavigationButton({ label, type, destination }: props) {
    if (type === "back") {
        return (
            <View style={backStyles.buttonContainer}>
                <Pressable style={backStyles.button} onPress={() => router.back()}>
                    <Image style={backStyles.buttonIcon} source={backIcon}/>
                </Pressable>
            </View>
        )
    }
    if (type === "push") {
        return (
            <View style={pushStyles.buttonContainer}>
                <Pressable style={pushStyles.button} onPress={() => router.replace(destination)}>
                    <Text style={pushStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
    if (type === "tab") {
        let icon = backIcon;
        switch (destination) {
            case "/shopping":
                icon = homeIcon;
                break;
            case "/savedLists":
                icon = listIcon;
                break;
            case "/profile":
                icon = settingsIcon;
                break;
            case "/savedRecipes":
                icon = recipeIcon;
                break;
            default:
                icon = backIcon;
                break;
        }
        return (
            <View style={tabStyles.buttonContainer}>
                <Pressable style={tabStyles.button} onPress={() => router.replace(destination)}>
                    <Image style={tabStyles.buttonIcon} source={icon}/>
                </Pressable>
            </View>
        )
    }
}

const pushStyles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#F6AA1C',
        borderRadius: 100,
        width: 150,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: "#232528",
        fontSize: 20,
    },
});

const backStyles = StyleSheet.create({
    buttonContainer: {
        width: 50,
        height: 50,
        marginTop: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        width: 25,
        height: 25,
    },

})

const tabStyles = StyleSheet.create({
    buttonContainer: {
        width: 50,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        width: 25,
        height: 25,
    },

})