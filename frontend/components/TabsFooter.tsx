import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import NavigationButton from './NavigationButton';
import {isAuthenticated} from "@/components/Axios";

export default function Footer() {
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
            // Run the authentication check
            const authStatus = await isAuthenticated();
            // console.log('Authentication status:', authStatus);
            setAuthenticated(authStatus);
        };

        checkAuthentication();
    }, []);
    return (
        <View style={styles.footerContainer}>
            {/*<NavigationButton label="tab" type="tab" destination={"/home"}/>
            <NavigationButton label="tab" type="tab" destination={"/shopping"}/>
            <NavigationButton label="tab" type="tab" destination={"/map"}/>
            <NavigationButton label="tab" type="tab" destination={"/profile"}/>*/}
            <View style={styles.tabRowContainer}>
                <View style={styles.tabContainer}>
                    <NavigationButton label="tab" type="tab" destination={"/shopping"}/>
                </View>
                <View style={styles.tabContainer}>
                    <NavigationButton label="tab" type="tab" destination={"/savedLists"}/>
                </View>
                <View style={styles.tabContainer}>
                    <NavigationButton label="tab" type="tab" destination={"/savedRecipes"}/>
                </View>
                {authenticated && <View style={styles.tabContainer}>
                    <NavigationButton label="tab" type="tab" destination={"/profile"}/>
                </View>
                }
                {/*<NavigationButton label="tab" type="tab" destination={"/home"}/>
                <NavigationButton label="tab" type="tab" destination={"/shopping"}/>
                <NavigationButton label="tab" type="tab" destination={"/map"}/>
                <NavigationButton label="tab" type="tab" destination={"/profile"}/>*/}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    footerContainer: {
        //flexDirection: 'row',
        //justifyContent: 'space-around', // Evenly distributes the items
        alignItems: 'center',
        backgroundColor: '#F6AA1C', // Light grey background color to match your image
        height: 80,
        width: '100%',
        //borderTopWidth: 1,
        //borderTopColor: '#ccc', // Slight border to separate footer from the rest of the content
    },
    tabRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,
        //marginHorizontal: 10,
    },
    tabContainer: {
        marginHorizontal: 15,
    },
    footerItem: {
        flex: 1,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#000', // Black text color
    },
});