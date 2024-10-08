import React from 'react';
import {
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
} from 'react-native';
import { CoreBridge, HistoryBridge, RichText, TaskListBridge, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import NavigationButton from "@/components/NavigationButton";

export default function Shopping() {
    const editor = useEditorBridge({
        bridgeExtensions: [
            CoreBridge.extendExtension({ content: 'taskList+' }),
            TaskListBridge,
            HistoryBridge
        ],
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent,
    });

    return (
        <View style={loginStyles.container}>
            <View style={loginStyles.headerContainer}>
                <NavigationButton label="Back" type="back" destination="/welcome" />
                <Text style={loginStyles.headerLabel}>Log in</Text>
                <View style={loginStyles.headerSpacer} />
            </View>
            <SafeAreaView style={loginStyles.contentContainer}>
                <RichText editor={editor} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={loginStyles.keyboardAvoidingView}
                >
                    <Toolbar editor={editor} />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const loginStyles = StyleSheet.create({
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
        flex: 1,
        marginTop: 50,
        marginBottom: 10,
        color: '#232528',
        fontSize: 28,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 50,
        height: 50,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    keyboardAvoidingView: {
        width: '100%',
        position: 'relative',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
});

const initialContent = `<p>This is a basic example!</p>`;
