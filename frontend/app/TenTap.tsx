import React from 'react';
import { SafeAreaView, StyleSheet, Platform, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { useEditorBridge, CoreBridge, TaskListBridge, HistoryBridge } from '@10play/tentap-editor';
import { RichText, Toolbar } from '@10play/tentap-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TenTap() {
  // Setting up the editor with taskList+ restriction
  const editor = useEditorBridge({
    bridgeExtensions: [
      CoreBridge.extendExtension({ content: 'taskList+' }), // Enforce task list as default
      TaskListBridge,  // To allow task list items
      HistoryBridge,   // To enable undo/redo functionality
    ],
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: `<p>This is a basic example of a task list!</p>`,
  });

  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const headerHeight = isLandscape ? 32 : 44;
  const keyboardVerticalOffset = headerHeight + top;

  return (
    <SafeAreaView style={styles.fullScreen}>
      {/* Main editor where users can add tasks */}
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {/* Undo/Redo toolbar */}
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
