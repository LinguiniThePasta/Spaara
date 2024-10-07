


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
//import { Stack } from 'expo-router';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';



import Button from '@/components/Button';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

const Stack = createNativeStackNavigator();





/*export default function Index() {
  return (
    <NavigationContainer>
      <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary"/>
            <Button label="Sign up" theme="primary"/>
          </View>
          <View style={styles.logInButtonsRow}>
            <Button label="or continue as Guest" theme="secondary"/>
          </View>
        </View>

        <StatusBar style="auto"/>
      </View>
    </NavigationContainer>
  );
}*/





/*export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{title: "Welcome"}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogInScreen}
          options={{title: "Log in"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/




export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary"/>
            <Button label="Sign up" theme="primary"/>
          </View>
          <View style={styles.logInButtonsRow}>
            <Button label="or continue as Guest" theme="secondary"/>
          </View>
        </View>

        <StatusBar style='auto'/>
      </View>
  );
}





function LogInScreen() {
  return (
    <View style={styles.container}>

        <View style={styles.logoImageContainer}>
          <Image
            style={styles.logoImage}
            source={spaaraLogoImage}
          />
        </View>

        <View style={styles.logInButtonsContainer}>
          <View style={styles.logInButtonsRow}>
            <Button label="Log in" theme="primary"/>
          </View>
        </View>

        <StatusBar style="auto"/>
      </View>
  );
}

// Define an interface for items in list
interface Item {
  id: number;
  name: string;
  price: number;
  store: string;
}

// Update the ViewListsScreen component
function ViewListsScreen() {
  const [items, setItems] = React.useState<Item[]>([]); // Try to set output into array of Item
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        // Call our API to get data
        const response = await fetch('http://127.0.0.1:8000/items/');
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.price} at {item.store}</Text>
          </View>
        )}
      />
    </View>
  );
}





const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFBEE',
    alignItems: 'center',
  },

  logoImageContainer: {
    paddingVertical: 110,
  },

  logoImage: {
    width: 300,
    height: 84,
  },

  logInButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  logInButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  listElementContainer: {
    flexDirection: 'column',
  },

  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
