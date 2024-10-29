import React, {useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Pressable} from 'react-native';
import Slider from '@react-native-community/slider';
import {RadioButton, Button, Checkbox} from 'react-native-paper';
import Header from "@/components/Header";
import {Colors} from "@/styles/Colors";
import {globalStyles} from "@/styles/globalStyles";

export default function FilterScreen() {
    const [numberOfStores, setNumberOfStores] = useState(3);
    const [distance, setDistance] = useState(5);
    const [dietaryRestriction, setDietaryRestriction] = useState([]);
    const dietRestrictionList = [
        "Lactose free",
        "Gluten free",
        "Vegetarian",
        "Vegan",
        "Kosher",
        "Halal",
    ]
    const handleClear = () => {
        setNumberOfStores(3);
        setDistance(5);
        setDietaryRestriction([]);
    };

    const handleApplyFilters = () => {
        console.log({
            numberOfStores,
            distance,
            dietaryRestriction,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header backButton={true}
                    backLink={"/settings"}
                    header={"Filters"}
                    noProfile={true}
            />
            <View style={styles.content}>
                <View>
                    <View style={styles.listItem}>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.subHeader}>Maximum number of stores</Text>
                            <Text style={styles.subHeader}> {numberOfStores}</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={1}
                                maximumValue={5}
                                step={1}
                                value={numberOfStores}
                                onValueChange={(value) => setNumberOfStores(value)}
                                minimumTrackTintColor={Colors.light.primaryText}
                                maximumTrackTintColor={Colors.light.secondaryText}
                                thumbTintColor={Colors.light.primaryText}
                            />
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.subHeader}>Distance away</Text>
                            <Text style={styles.subHeader}> {distance.toFixed(2)} mi</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.01}
                                maximumValue={15}
                                step={0.01}
                                value={distance}
                                onValueChange={(value) => setDistance(value)}
                                minimumTrackTintColor={Colors.light.primaryText}
                                maximumTrackTintColor={Colors.light.secondaryText}
                                thumbTintColor={Colors.light.primaryText}
                            />
                        </View>
                    </View>

                    <Text style={styles.subHeader}>Dietary Restrictions</Text>
                    {
                        dietRestrictionList.map((checkListItem) => (
                            <Checkbox.Item
                                label={checkListItem}
                                status={dietaryRestriction.includes(checkListItem) ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (dietaryRestriction.find(item => item === checkListItem)) {
                                        // Remove 'glutenFree' if found
                                        setDietaryRestriction(dietaryRestriction.filter(item => item !== checkListItem));
                                    } else {
                                        setDietaryRestriction([...dietaryRestriction, checkListItem]);
                                    }
                                }}
                            />
                        ))
                    }
                </View>

            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={handleClear}
                           style={styles.clearButton}>
                    <Text>Clear</Text>
                </Pressable>
                <Pressable
                    onPress={handleApplyFilters}
                    style={styles.applyButton}
                >
                    <Text>Apply Filters</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

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
        width: "45%"
    },
    applyButton: {
        ...globalStyles.primaryButton,
        width: "45%"
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
        width: '95%', // Make the slider 95% of the listItem width
        alignSelf: 'center', // Center the slider within the listItem
    },
    slider: {
        height: 40,
    },
});

