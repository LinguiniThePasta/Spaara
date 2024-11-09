import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import {Colors} from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';

const SetAddress: React.FC = () => {
    const [newAddress, setNewAddress] = useState({
        street_address: '',
        city: '',
        state: 'AL',
        zip_code: ''
    });

    const [currentAddress, setCurrentAddress] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(newAddress.state);

    const states = [
        { label: 'Alabama', value: 'AL' },
        { label: 'Alaska', value: 'AK' },
        { label: 'Arizona', value: 'AZ' },
        { label: 'Arkansas', value: 'AR' },
        { label: 'California', value: 'CA' },
        { label: 'Colorado', value: 'CO' },
        { label: 'Connecticut', value: 'CT' },
        { label: 'Delaware', value: 'DE' },
        { label: 'Florida', value: 'FL' },
        { label: 'Georgia', value: 'GA' },
        { label: 'Hawaii', value: 'HI' },
        { label: 'Idaho', value: 'ID' },
        { label: 'Illinois', value: 'IL' },
        { label: 'Indiana', value: 'IN' },
        { label: 'Iowa', value: 'IA' },
        { label: 'Kansas', value: 'KS' },
        { label: 'Kentucky', value: 'KY' },
        { label: 'Louisiana', value: 'LA' },
        { label: 'Maine', value: 'ME' },
        { label: 'Maryland', value: 'MD' },
        { label: 'Massachusetts', value: 'MA' },
        { label: 'Michigan', value: 'MI' },
        { label: 'Minnesota', value: 'MN' },
        { label: 'Mississippi', value: 'MS' },
        { label: 'Missouri', value: 'MO' },
        { label: 'Montana', value: 'MT' },
        { label: 'Nebraska', value: 'NE' },
        { label: 'Nevada', value: 'NV' },
        { label: 'New Hampshire', value: 'NH' },
        { label: 'New Jersey', value: 'NJ' },
        { label: 'New Mexico', value: 'NM' },
        { label: 'New York', value: 'NY' },
        { label: 'North Carolina', value: 'NC' },
        { label: 'North Dakota', value: 'ND' },
        { label: 'Ohio', value: 'OH' },
        { label: 'Oklahoma', value: 'OK' },
        { label: 'Oregon', value: 'OR' },
        { label: 'Pennsylvania', value: 'PA' },
        { label: 'Rhode Island', value: 'RI' },
        { label: 'South Carolina', value: 'SC' },
        { label: 'South Dakota', value: 'SD' },
        { label: 'Tennessee', value: 'TN' },
        { label: 'Texas', value: 'TX' },
        { label: 'Utah', value: 'UT' },
        { label: 'Vermont', value: 'VT' },
        { label: 'Virginia', value: 'VA' },
        { label: 'Washington', value: 'WA' },
        { label: 'West Virginia', value: 'WV' },
        { label: 'Wisconsin', value: 'WI' },
        { label: 'Wyoming', value: 'WY' },
    ];
    

    const handleChange = (name: string, value: string) => {
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    const fetchAddressString = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/user/address`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            setCurrentAddress(response.data.address);
            
        } catch (error) {
            console.error('Error getting address:', error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            
            const addressString = `${newAddress.street_address}, ${newAddress.city}, ${newAddress.state} ${newAddress.zip_code}`;

            const response = await axios.post(
                `${API_BASE_URL}/api/user/address`,
                {
                address: addressString,
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                }
            );
            console.log('Correctly set address!');
            fetchAddressString();
        } catch (error) {
            console.error('Error setting address:', error.message);
        }
    };

    useEffect(() => {
        fetchAddressString();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Set Address"
                    backButton={true}
                    backLink={"settings"}
                    noProfile={true}
            />
            <View style={styles.content}>
                <Text style={styles.subheader}>My Current Address</Text>
                <Text style={styles.subtext}>Your address is currently set to {currentAddress}</Text>
                <Text style={styles.subheader}>Reset Address</Text>
                <Text style={styles.label}>Street:</Text>
                <TextInput
                    style={styles.input}
                    value={newAddress.street_address}
                    onChangeText={(text) => handleChange('street_address', text)}
                />
                <Text style={styles.label}>City:</Text>
                <TextInput
                    style={styles.input}
                    value={newAddress.city}
                    onChangeText={(text) => handleChange('city', text)}
                />
                <Text style={styles.label}>State:</Text>
                <DropDownPicker
                    open={open}
                    value={selectedState}
                    items={states}
                    setOpen={setOpen}
                    setValue={(callback) => {
                        const newValue = callback(selectedState);
                        setSelectedState(newValue);
                        handleChange('state', newValue);
                    }}
                    style={styles.input} // Optional: add custom styling if needed
                />
                <Text style={styles.label}>ZIP Code:</Text>
                <TextInput
                    style={styles.input}
                    value={newAddress.zip_code}
                    onChangeText={(text) => handleChange('zip_code', text)}
                />
                <TouchableOpacity style={styles.genButton} onPress={() => handleSubmit()}>
                    <Text>Set Address</Text>
                </TouchableOpacity>
            </View>
            <Footer/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    genButton: {
        backgroundColor: Colors.light.primaryColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
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
    subheader: {
        fontSize: 24,
        marginBottom: 10
    },
    subtext: {
        fontSize: 12,
        marginBottom: 8
    },
    input: {
        height: 40,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    }
});

export default SetAddress;