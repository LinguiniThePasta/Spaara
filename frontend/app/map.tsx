import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';

export default function App() {
    const [addressCoords, setAddressCoords] = useState(null);   

    // Get the user's home location
    // Get a user's friends
    const fetchAddressString = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');

            const response = await axios.get(`${API_BASE_URL}/api/user/address`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            return response.data.address;
        } catch (error) {
            return null;
        }
    };

    // Get address coordinates
    const fetchAddressCoords = async () => {
        const addressString = await fetchAddressString(); // Wait for address to be fetched

        if (addressString) {
            console.log(`${API_BASE_URL}/api/maps/coords_of/?address=${encodeURIComponent(addressString)}`)
            try {
                const jwtToken = await SecureStore.getItemAsync('jwtToken');

                const response = await axios.get(`${API_BASE_URL}/api/maps/coords_of/?address=${encodeURIComponent(addressString)}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setAddressCoords({
                    latitude: response.data.latitude,
                    longitude: response.data.longitude
                });
            } catch (error) {
                console.error('Error fetching address coords:', error.message);
            }
        }
    };

  useEffect(() => {
    fetchAddressCoords();
  }, []);

  if (!addressCoords) {
    return null; // Render a loader or placeholder
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...addressCoords,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={addressCoords} title="My Address">
            <View style={styles.marker}>
                <Icon name="home" size={15} color={Colors.light.primaryColor} />
            </View>
        </Marker>
      </MapView>
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
});