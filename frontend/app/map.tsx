import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import * as Location from 'expo-location';
import { StatusBar } from "expo-status-bar";
import Button from '@/components/Button';
import TabsFooter from '@/components/TabsFooter';

export default function MapScreen() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [usernameText, onUsernameChangeText] = useState('');
  const [passwordText, onPasswordChangeText] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  const pushLogin = () => alert("Log in");

  return (
    <View style={mapStyles.container}>
      <View style={mapStyles.headerContainer}>
        <View style={mapStyles.headerSpacer} />
        <Text style={mapStyles.headerLabel}>Map</Text>
        <View style={mapStyles.headerSpacer} />
      </View>

      <View style={mapStyles.contentContainer}>
        <View style={mapStyles.mapPosition}>
          {latitude && longitude ? (
            <Text style={mapStyles.locationText}>
              Latitude: {latitude.toFixed(4)}, Longitude: {longitude.toFixed(4)}
            </Text>
          ) : (
            <Text style={mapStyles.locationText}>Fetching location...</Text>
          )}
        </View>
        <TextInput
          style={mapStyles.textInputField}
          onChangeText={onUsernameChangeText}
          value={usernameText}
          placeholder="Set Search Radius"
        />
        <View style={mapStyles.loginButtonsContainer}>
          <Button label="Set Home Location" theme="primary-wide" onPress={pushLogin} />
        </View>
      </View>
      <TabsFooter />
      <StatusBar style='auto' />
    </View>
  );
}

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: '#F6AA1C',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    width: 290,
    marginTop: 50,
    marginBottom: 10,
    color: '#232528',
    fontSize: 28,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 50,
    height: 50,
    marginTop: 50,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  mapPosition: {
    width: 325,
    height: 325,
    marginVertical: 50,
    borderRadius: 10,
    backgroundColor: '#959595',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  textInputField: {
    height: 20,
    width: 325,
    margin: 25,
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#959595',
    color: '#232528',
  },
  loginButtonsContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
});
