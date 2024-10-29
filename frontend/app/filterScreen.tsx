import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Slider} from '@react-native-community/slider';
import {RadioButton, Button} from 'react-native-paper';

export default function FilterScreen() {
    const [numberOfStores, setNumberOfStores] = useState(1);
    const [distance, setDistance] = useState(5);
    const [dietaryRestriction, setDietaryRestriction] = useState('');

    const handleClear = () => {
        setNumberOfStores(1);
        setDistance(5);
        setDietaryRestriction('');
    };

    const handleApplyFilters = () => {
        console.log({
            numberOfStores,
            distance,
            dietaryRestriction,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Filters</Text>

            <View style={styles.sliderContainer}>
                <Text>Number of stores: {numberOfStores}</Text>
                <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={numberOfStores}
                    onValueChange={(value) => setNumberOfStores(value)}
                />
            </View>

            <View style={styles.sliderContainer}>
                <Text>Distance away: {distance} mi</Text>
                <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={distance}
                    onValueChange={(value) => setDistance(value)}
                />
            </View>

            <Text style={styles.subHeader}>Dietary Restrictions</Text>
            <RadioButton.Group
                onValueChange={(value) => setDietaryRestriction(value)}
                value={dietaryRestriction}
            >
                <RadioButton.Item label="Gluten Free" value="glutenFree"/>
            </RadioButton.Group>

            <View style={styles.buttonContainer}>
                <Button onPress={handleClear} mode="text" style={styles.clearButton}>
                    Clear
                </Button>
                <Button
                    mode="contained"
                    onPress={handleApplyFilters}
                    style={styles.applyButton}
                >
                    Apply Filters
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sliderContainer: {
        marginVertical: 15,
    },
    subHeader: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    clearButton: {
        flex: 1,
        marginRight: 10,
    },
    applyButton: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#FFA726',
    },
});

