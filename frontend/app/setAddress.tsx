import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '@/styles/Colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';
import { globalStyles } from '@/styles/globalStyles';
import UnifiedIcon from '@/components/UnifiedIcon';

const SetAddress: React.FC = () => {
    const [newAddress, setNewAddress] = useState('');
    const [autocompletePredictions, setAutocompletePredictions] = useState([]);
    const [addresses, setAddresses] = useState([]);
    // Dropdown visibility state
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const renderItem = ({ item }) => (
        <TouchableOpacity
          style={styles.addressItem}
          onPress={() => handleAddressSelect(item.id)}
          onLongPress={() => handleDeleteAddress(item.id)}
        >
          {item.icon && (
            <UnifiedIcon
              type={item.icontype}
              name={item.icon}
              size={30}
              style={
                item.icon === 'location-arrow' ? styles.locationIcon : styles.addressIcon
              }
              color={null}
            />
          )}
          <Text style={styles.addressText}>{item.name}</Text>
          {selectedAddressId === item.id && (
            <UnifiedIcon
              type="ionicon"
              name="checkmark"
              size={30}
              style={styles.checkIcon}
              color={null}
            />
          )}
        </TouchableOpacity>
      );
    

    // Fetches the addresses of the user
    const fetchAddresses = async () => {
        try {
          const jwtToken = await SecureStore.getItemAsync('jwtToken');
          const response = await axios.get(`${API_BASE_URL}/api/user/addresses/`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
          setAddresses(response.data.addresses || []);
          setSelectedAddressId(response.data.selected_address_id || null);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
    };

    // Updates the selected id
    const handleAddressSelect = async (addressId) => {
        try {
          setSelectedAddressId(addressId);
          const jwtToken = await SecureStore.getItemAsync('jwtToken');
          await axios.post(
            `${API_BASE_URL}/api/user/addresses/update_selected/`,
            { selected_address_id: addressId },
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
        } catch (error) {
          console.error('Error updating selected address:', error);
        }
      };

      // Handles deleting an address
      const handleDeleteAddress = (addressId) => {
        if (addressId !== 1) {
            if (selectedAddressId !== addressId) {
                Alert.alert(
                    "Delete Confirmation",
                    "Are you sure you want to remove this address?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {text: "Delete", style: "destructive", onPress: () => deleteAddress(addressId)}
                    ],
                    {cancelable: false}
                );
            } else {
                Alert.alert(
                    "Error",
                    "Cannot delete the selected address. Please select another address and try again."
                );
            }
        } else {
            Alert.alert(
                "Error",
                "Cannot delete the current location option. Please select another address and try again."
            );
        }
      }

      // Adds a new address to the user's addresses
      const setAddress = async (address) => {
        try {
          const jwtToken = await SecureStore.getItemAsync('jwtToken');
          // Add the new address to the backend
          await axios.post(
            `${API_BASE_URL}/api/user/addresses/add/`,
            {
              address: address,
              icon: 'location',
              icontype: 'ionicon',
            },
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
          // Refresh the addresses list
          const response = await axios.get(`${API_BASE_URL}/api/user/addresses/`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
          setAddresses(response.data.addresses || []);
          setSelectedAddressId(response.data.selected_address_id || null);
          setNewAddress('');
          setAutocompletePredictions([]);
          setDropdownVisible(false);
        } catch (error) {
          console.error('Error adding new address:', error);
        }
      };

    // Delete a user's address
    const deleteAddress = async (addressId) => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            // Add the new address to the backend
            await axios.delete(
            `${API_BASE_URL}/api/user/addresses/remove/`,
            {
                data: { address_id: addressId },
                headers: { Authorization: `Bearer ${jwtToken}` },
            }
            );
            // Refresh the addresses list
            const response = await axios.get(`${API_BASE_URL}/api/user/addresses/`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setAddresses(response.data.addresses || []);
            setSelectedAddressId(response.data.selected_address_id || null);
            setNewAddress('');
            setAutocompletePredictions([]);
            setDropdownVisible(false);
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    // Fetches autocomplete predictions based on the input address
    const getAutocompletePredictions = async (address) => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/maps/address_predictions`,  // Adjusted endpoint for autocomplete
                { search_text: address },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            let predictions = response.data.addresses || [];

            // Get names of existing addresses
            const existingAddressNames = addresses.map(addr => addr.name.toLowerCase());
    
            // Filter out existing addresses from predictions
            predictions = predictions.filter(prediction => !existingAddressNames.includes(prediction.toLowerCase()));
    
            setAutocompletePredictions(predictions);
        } catch (error) {
            console.error('Error fetching address predictions:', error.message);
        }
    };

    // Update address and trigger autocomplete
    const handleChange = (text) => {
        setNewAddress(text);
        if (text) {
          getAutocompletePredictions(text);
          setDropdownVisible(true);
        } else {
          setAutocompletePredictions([]);
          setDropdownVisible(false);
        }
    };

    // Close dropdown when touching outside
    const handleOutsidePress = () => {
        if (dropdownVisible) {
        setDropdownVisible(false);
        Keyboard.dismiss(); // Hide the keyboard if visible
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header
          header="Set Address"
          backButton={true}
          backLink={"settings"}
          noProfile={false}
        />
        <View style={styles.content}>
          <Text style={styles.subheader}>Add Address</Text>
          <View style={styles.searchContainer}>
            <View style={globalStyles.searchBar}>
              <UnifiedIcon
                type="ionicon"
                name="search-outline"
                size={20}
                style={styles.searchIcon}
                color={null}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for an Address"
                placeholderTextColor={Colors.light.secondaryText}
                value={newAddress}
                onChangeText={handleChange}
                onFocus={() => setDropdownVisible(true)}
              />
            </View>
            {dropdownVisible && autocompletePredictions.length > 0 && (
              <View style={styles.dropdown}>
                <FlatList
                  data={autocompletePredictions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => setAddress(item)}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyPredictionText}>No suggestions available</Text>
                  )}
                />
              </View>
            )}
          </View>
          <Text style={styles.subheader}>Existing Addresses</Text>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </SafeAreaView>
      <Footer />
      </View>
    </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        position: 'relative',
        zIndex: 2,
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        width: 270,
        left: '50%',
        transform: [{ translateX: -135 }],
        backgroundColor: 'white',
        borderColor: Colors.light.primaryColor,
        borderWidth: 1,
        borderRadius: 4,
        maxHeight: 150,
        zIndex: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.primaryText,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.primaryColor,
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
    },
    predictionItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    predictionName: {
        fontWeight: 'bold',
    },
    emptyPredictionText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 20,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomColor: Colors.light.secondaryText,
        borderBottomWidth: 1,
      },
      addressIcon: {
        color: Colors.light.primaryColor,
      },
      locationIcon: {
        color: "#14b7f7",
      },
      addressText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: Colors.light.primaryText,
      },
      checkIcon: {
        color: Colors.light.primaryColor,
        marginLeft: 10,
      },
});

export default SetAddress;
