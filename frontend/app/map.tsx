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
    const [isCurrent, setIsCurrent] = useState(false); // State to store if current location is being used
    const [currentLocation, setCurrentLocation] = useState(null);

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
        // Assign current location
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
        setCurrentLocation(locationCoords);
        if (selectedAddress['latitude'] && selectedAddress['longitude']) {
            // Use selected address
            const selectedCoords = {
                latitude: selectedAddress['latitude'],
                longitude: selectedAddress['longitude'],
            };
            setAddressCoords(selectedCoords);
            // Check as the crow flies distance between selected address and current location, give alert if too far
            const distance = getDistance(locationCoords.latitude, locationCoords.longitude, selectedCoords.latitude, selectedCoords.longitude);
            if (distance > 50) {
                Alert.alert(
                    "Selected Address is Far",
                    "Your selected address is far away from your current location. Are you sure you want to proceed?",
                    [
                        {
                            text: "Continue",
                            style: "default",
                        },
                        {
                            text: "Change Address",
                            style: "cancel",
                            onPress: () => router.replace("/setAddress"),
                        },
                    ],
                    { cancelable: true }
                );
            } else {
                setIsCurrent(false);
                fetchStores(selectedCoords.latitude, selectedCoords.longitude)
            }
            fetchStores()
        } else {
            // Use user's current location
            Alert.alert(
                "No Address Set", // Title of the alert
                "You do not currently have an address set for the map to use. Stores will be generated around your current location, and the navigate home feature will be disabled.", // Message
                [
                    {
                        text: "Set Address", // Text for the first button
                        style: "default", // Optional: can be "default", "cancel", or "destructive"
                        onPress: () => router.replace("/setAddress"), // Action for the second button
                        
                    },
                    {
                        text: "Dismiss", // Text for the second button
                        style: "cancel",
                        
                    },
                ],
                { cancelable: true } // Allow alert dismissal by tapping outside
            );
            setIsCurrent(true);
            setAddressCoords(locationCoords);
            fetchStores(locationCoords.latitude, locationCoords.longitude)
        }
    };

    // Uses spherical geometry to calculate distance between two coordinates on Earth
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degree) => (degree * Math.PI) / 180;
    
        const R = 3963.1; // Radius of the Earth in miles
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c; // Distance in miles
    };

    // Use address lat, long, and user preference radius to find Krogers
    const fetchStores = async (latitude = NaN, longitude = NaN) => {
        try {
            // Retrieve the JWT token
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            
            // Build the request URL based on whether latitude and longitude are provided
            const url = latitude && longitude
                ? `${API_BASE_URL}/api/maps/locations/stores?latitude=${latitude}&longitude=${longitude}`
                : `${API_BASE_URL}/api/maps/locations/stores`;

            // Make the API call
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            // Update the state with the fetched stores
            setStores(response.data.stores);
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
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
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
                 <Marker coordinate={currentLocation}>
                    <View style={styles.markerContainer}>
                        <View style={styles.outerCircle}>
                            <View style={styles.innerCircle} />
                        </View>
                        <Callout tooltip={true} />
                    </View>
                    
                </Marker>
                {addressCoords && !isCurrent && (
                    <Marker coordinate={addressCoords} title="My Address">
                        <View style={styles.marker}>
                            <UnifiedIcon type="materialicon" name="home" size={15} color={Colors.light.primaryColor} />
                        </View>

                        <Callout tooltip onPress={() => handleNavigateHome()}>
                            <View style={styles.calloutContainer}>
                                <View style={styles.calloutRow}>
                                    {/* Left: Name and Address */}
                                    <View style={styles.calloutLeft}>
                                        <Text style={styles.calloutTitle}>Home Address</Text>
                                    </View>
                                    {/* Divider */}
                                    <View style={styles.calloutDivider} />
                                    {/* Right: Clickable Map Icon */}
                                        <TouchableOpacity style={styles.calloutIconContainer}>
                                            <UnifiedIcon
                                                type="materialicon"
                                                name="directions"
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
                        <Callout tooltip onPress={() => handleNavigate(store)}>
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
                                    <TouchableOpacity style={styles.calloutIconContainer}>
                                        <UnifiedIcon
                                            type="materialicon"
                                            name="directions"
                                            size={32}
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
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#007AFF', // Blue color for the inner dot
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
        width: 300,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
      },
      calloutRow: {
        flexDirection: 'row', // Ensures children are placed in a row
        alignItems: 'center', // Vertically centers the items
        justifyContent: 'space-between', // Distributes space between children
        width: '100%', // Ensures the row takes up the full width
    },
    
    calloutLeft: {
        flex: 1, // Allows the left section to take remaining space
        paddingRight: 10, // Adds spacing between text and divider
    },
    
    calloutDivider: {
        width: 1,
        height: '60%', // Adjusts divider height to fit better visually
        backgroundColor: '#ccc',
        marginHorizontal: 10, // Adds spacing around the divider
    },
    
    calloutIconContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 5, // Adds padding to the icon
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
