import React from 'react';
import {View, Text, SafeAreaView, Pressable, StyleSheet} from 'react-native';
import {Colors} from '@/styles/Colors'; // Make sure Colors is configured
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {router} from 'expo-router'; // Use router for navigation if needed

export default function SettingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Header header="Settings"
                    backButton={true}
                    backLink={"profile"}
                    noProfile={true}
            />

            <View style={styles.content}>
                <View>
                    <Pressable style={styles.listItem} onPress={() => router.push('/filterScreen')}>
                        <Text style={styles.optionText}>Configure Filters</Text>
                    </Pressable>
                    <Pressable style={styles.listItem} onPress={() => router.push('themes')}>
                        <Text style={styles.optionText}>Themes</Text>
                    </Pressable>
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

