import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import NavigationButton from './NavigationButton';

export default function Footer() {
    /*return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Shopping List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
                <Text style={styles.footerText}>Recipes</Text>
            </TouchableOpacity>
        </View>
    );*/
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
                <View style={styles.tabContainer}>
                    <NavigationButton label="tab" type="tab" destination={"/profile"}/>
                </View>
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