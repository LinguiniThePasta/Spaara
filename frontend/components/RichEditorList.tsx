import {RichText, Toolbar} from "@10play/tentap-editor";
import React from 'react';
import {
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
} from 'react-native';
import {CoreBridge, HistoryBridge, TaskListBridge, useEditorBridge} from '@10play/tentap-editor';
import NavigationButton from "@/components/NavigationButton";

export default function RichEditorList() {
    const editor = useEditorBridge({
        bridgeExtensions: [
            CoreBridge.extendExtension({content: 'taskList+'}),
            TaskListBridge,
            HistoryBridge
        ],
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent,
    });

    return (
        <View style={loginStyles.container}>
            <SafeAreaView style={loginStyles.contentContainer}>
                <RichText editor={editor}/>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={loginStyles.keyboardAvoidingView}
                >
                    <Toolbar editor={editor}/>
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

