import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform} from "react-native";
import React from "react";
import NavigationButton from '@/components/NavigationButton';
import {CoreBridge, HistoryBridge, RichText, TaskListBridge, Toolbar, useEditorBridge} from '@10play/tentap-editor';

const spaaraLogoImage = require('@/assets/images/SpaaraLogo.png');

//const Stack = createNativeStackNavigator();
//const router = useRouter();
//router.navigate("/login");





//const pushLogin = () => router.push("/login")
//const pushLogin = () => alert("I wanna push!!!!");

export default function Shopping() {
  //const pushLogin = () => router.push("/login")
  const pushLogin = () => alert("Log in");
  const [usernameText, onUsernameChangeText] = React.useState('');
  const [passwordText, onPasswordChangeText] = React.useState('');
  const editor = useEditorBridge({
        bridgeExtensions: [
            CoreBridge.extendExtension({ content: 'taskList+'}),
            TaskListBridge,
            HistoryBridge
        ],
        autofocus: true,
        avoidIosKeyboard: true,
    });

  return (
    <View style={shoppingListStyles.container}>

        <View style={shoppingListStyles.headerContainer}>
          <NavigationButton label="Back" type="back" destination="/welcome"/>
          <Text style={shoppingListStyles.headerLabel}>Log in</Text>
          <View style={shoppingListStyles.headerSpacer}/>
        </View>

        <SafeAreaView style={shoppingListStyles.contentContainer}>
          <RichText editor={editor}/>
          <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={shoppingListStyles.keyboardAvoidingView}
          >
              <Toolbar editor={editor}/>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <StatusBar style='auto'/>
      </View>
  );
}



const shoppingListStyles = StyleSheet.create({

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

  separatorContainer: {
    flexDirection: 'row',
    width: 325,
    height: 25,
    marginTop: 25,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  separatorLabel: {
    width: 41,
    height: 20,
    color: '#959595',
    fontSize: 15,
    textAlign: 'center'
  },

  separatorSpacer: {
    width: 142,
    height: 1,
    marginVertical: 12,
    backgroundColor: '#959595',
    borderRadius: 100,
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

  keyboardAvoidingView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
  },

});
