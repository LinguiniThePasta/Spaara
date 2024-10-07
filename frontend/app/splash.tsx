


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React from "react";
import { Stack, useRouter, Link } from 'expo-router';
//import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";



import Button from '@/components/Button';

const spaaraIconImage = require('@/assets/images/SpaaraIcon.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function SplashScreen() {
    //const pushLogin = () => router.push("/login")
    const pushLogin = () => alert("I wanna push!!!!");
    return (
      <View style={splashStyles.container}>
          <Image style={splashStyles.iconImage} source={spaaraIconImage}/>
          <StatusBar style='auto'/>
        </View>
    );
  }
  
  
  
  const splashStyles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: '#FFFBEE',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    iconImage: {
      width: 150,
      height: 107,
    },
  
  });
  