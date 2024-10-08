import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        if (option === 'Profile') {
            navigation.navigate('Profile');
        } else {
            console.log(option); // Handle "Log in" or "Log out" logic here
        }
    };

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.zipCodeText}>11111</Text>
            <View style={styles.profileContainer}>
                <Text style={styles.welcomeText}>Welcome, Guest</Text>
                <TouchableOpacity onPress={toggleMenu}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/40' }} // Placeholder profile image
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
            {menuVisible && (
                <View style={[styles.dropdownMenu, { top: 60 }]}>
                    <TouchableOpacity onPress={() => handleMenuOption('Log in')}>
                        <Text style={styles.dropdownItem}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMenuOption('Log out')}>
                        <Text style={styles.dropdownItem}>Log out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMenuOption('Profile')}>
                        <Text style={styles.dropdownItem}>Profile</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative',
        zIndex: 2,
    },
    zipCodeText: {
        fontSize: 18,
        color: '#333',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: '#333',
        marginRight: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    dropdownMenu: {
        position: 'absolute',
        right: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        zIndex: 3,
    },
    dropdownItem: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
});
