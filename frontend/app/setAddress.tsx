import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SetAddress: React.FC = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (name: string, value: string) => {
        setAddress({
            ...address,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://your-backend-api.com/set-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(address)
            });

            if (response.ok) {
                alert('Address set successfully!');
            } else {
                alert('Failed to set address.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Set Address"
                    backButton={true}
                    backLink={"settings"}
                    noProfile={true}
            />
            <View style={styles.content}>
                <Text style={styles.label}>Street:</Text>
                <TextInput
                    style={styles.input}
                    value={address.street}
                    onChangeText={(text) => handleChange('street', text)}
                />
                <Text style={styles.label}>City:</Text>
                <TextInput
                    style={styles.input}
                    value={address.city}
                    onChangeText={(text) => handleChange('city', text)}
                />
                <Text style={styles.label}>State:</Text>
                <TextInput
                    style={styles.input}
                    value={address.state}
                    onChangeText={(text) => handleChange('state', text)}
                />
                <Text style={styles.label}>ZIP Code:</Text>
                <TextInput
                    style={styles.input}
                    value={address.zip}
                    onChangeText={(text) => handleChange('zip', text)}
                />
                <Button title="Set Address" onPress={handleSubmit} />
            </View>
            <Footer/>
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
    },
    label: {
        fontSize: 16,
        marginBottom: 8
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    }
});

export default SetAddress;