import React from 'react';
import {
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import {CoreBridge, HistoryBridge, RichText, TaskListBridge, Toolbar, useEditorBridge} from '@10play/tentap-editor';

export default function TenTap() {
    const editor = useEditorBridge({
        bridgeExtensions: [
            CoreBridge.extendExtension({ content: 'taskList+'}),
            TaskListBridge,
            HistoryBridge
        ],
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent,
    });

    return (
        <SafeAreaView style={exampleStyles.fullScreen}>
            <RichText editor={editor}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={exampleStyles.keyboardAvoidingView}
            >
                <Toolbar editor={editor}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const exampleStyles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    keyboardAvoidingView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
});

const initialContent = `<p>This is a basic example!</p>`;