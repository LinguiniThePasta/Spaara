import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text, Pressable } from 'react-native';
import { Colors } from '@/styles/Colors';
import {router} from 'expo-router';
import Footer from "@/components/Footer";
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import UnifiedIcon from '@/components/UnifiedIcon';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function App() {
    const [addressCoords, setAddressCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stores, setStores] = useState([]); // State to store Kroger locations
    const mapRef = useRef(null); // Reference to MapView

    const fetchSelectedAddress = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.get(`${API_BASE_URL}/api/user/addresses/selected/`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            return response.data.address;
        } catch (error) {
            console.error('Error getting selected address:', error.message);
            Alert.alert('Error', 'Unable to fetch selected address. Please try again.');
            return null;
        }
    };

    const fetchAddressCoords = async () => {
        const selectedAddress = await fetchSelectedAddress();
        if (selectedAddress['latitude'] && selectedAddress['longitude']) {
            // Use selected address
            const locationCoords = {
                latitude: selectedAddress['latitude'],
                longitude: selectedAddress['longitude'],
            };
            setAddressCoords(locationCoords);
            fetchStores(); // Fetch nearby stores using selected
        } else {
            // Use user's current location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Allow location access to use current location.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            const locationCoords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setAddressCoords(locationCoords);
            fetchStores(); // Fetch nearby stores using location
        }
    };

    // Use address lat, long, and user preference radius to find Krogers
    const fetchStores = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.get(`${API_BASE_URL}/api/maps/locations/stores`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setStores(response.data.stores); // Set stores data to state
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching stores:', error.message);
            Alert.alert('Error', 'Unable to fetch stores. Please try again.');
            setIsLoading(false);
        }
    };

    const handleNavigate = (store) => {
        const url = `https://maps.apple.com/?daddr=${store.coordinates.latitude},${store.coordinates.longitude}&dirflg=d`;
        Linking.openURL(url);
    }

    const handleNavigateHome = () => {
        const url = `https://maps.apple.com/?daddr=${addressCoords.latitude},${addressCoords.longitude}&dirflg=d`;
        Linking.openURL(url);
    }

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchAddressCoords();
        }, []) // Empty dependency array to run only when screen is focused
    );

    // Animate to user's location once addressCoords is set
    useEffect(() => {
        if (addressCoords && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    ...addressCoords,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                },
                1000 // Duration of the animation in milliseconds
            );
        }
    }, [addressCoords]);

    return (
        <View style={styles.container}>
            <MapView
                key={stores.length} // Add this line
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: addressCoords ? addressCoords.latitude : 37.7749,
                    longitude: addressCoords ? addressCoords.longitude : -122.4194,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {addressCoords && (
                    <Marker coordinate={addressCoords} title="My Address">
                        <View style={styles.marker}>
                            <UnifiedIcon type="materialicon" name="home" size={15} color={Colors.light.primaryColor} />
                        </View>
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                            <View style={styles.calloutRow}>
                                {/* Left: Name and Address */}
                                <View style={styles.calloutLeft}>
                                <Text style={styles.calloutTitle}>Home Address</Text>
                                </View>
                                {/* Divider */}
                                <View style={styles.calloutDivider} />
                                {/* Right: Clickable Map Icon */}
                                <TouchableOpacity onPress={() => handleNavigateHome()}>
                                <UnifiedIcon
                                    type="materialicon"
                                    name="map"
                                    size={24}
                                    color={Colors.light.primaryColor}
                                />
                                </TouchableOpacity>
                            </View>
                            </View>
                        </Callout>
                    </Marker>
                )}
                {stores.map((store, index) => (
                    <Marker
                        key={store.name + index}
                        coordinate={{
                            latitude: parseFloat(store.coordinates.latitude),
                            longitude: parseFloat(store.coordinates.longitude),
                        }}
                        title={store.name}
                    >
                        <View style={styles.storeMarker}>
                            <UnifiedIcon type="materialicon" name="store" size={15} color={Colors.light.primaryColor} />
                        </View>
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                            <View style={styles.calloutRow}>
                                {/* Left: Name and Address */}
                                <View style={styles.calloutLeft}>
                                <Text style={styles.calloutTitle}>{store.name}</Text>
                                <Text style={styles.calloutText}>{store.address}</Text>
                                </View>
                                {/* Divider */}
                                <View style={styles.calloutDivider} />
                                {/* Right: Clickable Map Icon */}
                                <TouchableOpacity onPress={() => handleNavigate(store)}>
                                <UnifiedIcon
                                    type="materialicon"
                                    name="map"
                                    size={24}
                                    color={Colors.light.primaryColor}
                                />
                                </TouchableOpacity>
                            </View>
                            </View>
                        </Callout>

                    </Marker>
                ))}
            </MapView>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.light.primaryColor} />
                </View>
            )}
            {/* Book icon button to navigate to Set Addresses */}
            <TouchableOpacity
                style={styles.settingsIcon}
                onPress={() => router.replace('/settings')} // Navigate to the SetAddress page
            >
                <UnifiedIcon type="ionicon" name="settings" style={null} size={30} color={Colors.light.primaryColor} />
            </TouchableOpacity>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    map: {
        flex: 1,
    },
    marker: {
        backgroundColor: Colors.light.background,
        padding: 2,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    storeMarker: {
        backgroundColor: Colors.light.background,
        padding: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsIcon: {
        position: 'absolute',
        bottom: 120, // Above the footer
        right: 20, // Right side of the screen
        backgroundColor: Colors.light.background,
        borderRadius: 20,
        padding: 10,
        elevation: 3, // Adds a shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    calloutContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 250,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
      },
      calloutRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      calloutLeft: {
        flex: 1,
        paddingLeft: 10,
      },
      calloutDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#ccc',
        marginHorizontal: 10,
      },
      calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
      },
      calloutText: {
        fontSize: 14,
        color: '#666',
      },
});
