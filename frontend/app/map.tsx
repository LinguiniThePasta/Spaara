import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import Footer from "@/components/Footer";
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function App() {
  const [addressLocation, setAddressLocation] = useState(null);

  useEffect(() => {
    const address = "3609 Laurel Avenue, Manhattan Beach, CA, USA, 90266";
    const apiKey = 'AIzaSyAIGeLTkAGtW-uT3XeHZ2p3g5LCD0vL8JM'; // Replace with your geocoding API key

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setAddressLocation({
            latitude: location.lat,
            longitude: location.lng,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!addressLocation) {
    return null; // Render a loader or placeholder
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...addressLocation,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={addressLocation} title="My Address">
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