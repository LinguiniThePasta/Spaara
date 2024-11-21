import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Pressable, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'react-native-paper';
import Header from "@/components/Header";
import { Colors } from "@/styles/Colors";
import { globalStyles } from "@/styles/globalStyles";
import axios from "axios";
import { API_BASE_URL } from "@/scripts/config";
import * as SecureStore from "expo-secure-store";

export default function FilterScreen() {
    const [numberOfStores, setNumberOfStores] = useState(3);
    const [distance, setDistance] = useState(5.0);
    const [dietaryRestriction, setDietaryRestriction] = useState([]);
    const [dietRestrictionList, setDietRestrictionList] = useState([]);

    // UseRef to store initial state
    const initialSettings = useRef({
        numberOfStores: 3,
        distance: 5,
        dietaryRestriction: [],
    });

    useEffect(() => {
        const getDietRestrictions = async () => {
            try {
                const jwtToken = await SecureStore.getItemAsync("jwtToken");
                const response = await axios.get(
                    `${API_BASE_URL}/api/user/save_settings`, {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    });
                setDietRestrictionList(response.data.all_restrictions);
                setDietaryRestriction(response.data.user_restrictions);
                setDistance(response.data.max_distance);
                setNumberOfStores(response.data.max_stores);

                // Update initial settings
                initialSettings.current = {
                    numberOfStores: response.data.max_stores,
                    distance: response.data.max_distance,
                    dietaryRestriction: response.data.user_restrictions,
                };
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };
        getDietRestrictions();
    }, []);

    const handleClear = () => {
        setNumberOfStores(3);
        setDistance(5);
        setDietaryRestriction([]);
    };

    const handleApplyFilters = async () => {
        // Check if changes were made
        const { numberOfStores: initialStores, distance: initialDistance, dietaryRestriction: initialRestrictions } = initialSettings.current;
        const noChanges = (
            numberOfStores === initialStores &&
            distance === initialDistance &&
            JSON.stringify(dietaryRestriction) === JSON.stringify(initialRestrictions)
        );

        if (noChanges) {
            Alert.alert("No Changes", "You haven't made any changes to save.");
            return;
        }

        // Save changes if there are any
        try {
            const jwtToken = await SecureStore.getItemAsync("jwtToken");
            await axios.post(
                `${API_BASE_URL}/api/user/save_settings`, {
                    max_stores: numberOfStores,
                    max_distance: distance,
                    user_restrictions: dietaryRestriction
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });
        } catch (error) {
            console.error('Error applying filters:', error);
        }
        console.log({
            numberOfStores,
            distance,
            dietaryRestriction,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header backButton={true} backLink={"/settings"} header={"Filters"} noProfile={false} />
            <View style={styles.content}>
                <View>
                    <View style={styles.listItem}>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.subHeader}>Maximum number of stores</Text>
                            <Text style={styles.subHeader}> {numberOfStores}</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1}
                                maximumValue={5}
                                step={1}
                                value={numberOfStores}
                                onValueChange={setNumberOfStores}
                                minimumTrackTintColor={Colors.light.primaryText}
                                maximumTrackTintColor={Colors.light.secondaryText}
                                thumbTintColor={Colors.light.primaryText}
                            />
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.subHeader}>Distance away</Text>
                            <Text style={styles.subHeader}> {distance} mi</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={15}
                                step={1}
                                value={distance}
                                onValueChange={setDistance}
                                minimumTrackTintColor={Colors.light.primaryText}
                                maximumTrackTintColor={Colors.light.secondaryText}
                                thumbTintColor={Colors.light.primaryText}
                            />
                        </View>
                    </View>

                    <Text style={styles.subHeader}>Dietary Restrictions</Text>
                    {dietRestrictionList.map((checkListItem) => (
                        <View key={checkListItem.id}>
                            <Checkbox.Item
                                label={checkListItem.name}
                                status={dietaryRestriction.includes(checkListItem.id) ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setDietaryRestriction(prevState =>
                                        prevState.includes(checkListItem.id)
                                            ? prevState.filter(id => id !== checkListItem.id)
                                            : [...prevState, checkListItem.id]
                                    );
                                }}
                            />
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={handleClear} style={styles.clearButton}>
                    <Text>Clear</Text>
                </Pressable>
                <Pressable onPress={handleApplyFilters} style={styles.applyButton}>
                    <Text>Apply Filters</Text>
                </Pressable>
            </View>
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
        justifyContent: "space-between",
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "regular",
        color: Colors.light.primaryText,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    clearButton: {
        ...globalStyles.secondaryGreyButton,
        width: "45%",
    },
    applyButton: {
        ...globalStyles.primaryButton,
        width: "45%",
    },
    listItem: {
        marginVertical: 15,
        paddingVertical: 20,
        justifyContent: 'space-between',
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
        position: 'relative',
    },
    sliderContainer: {
        width: '95%',
        alignSelf: 'center',
    },
    slider: {
        height: 40,
    },
});
