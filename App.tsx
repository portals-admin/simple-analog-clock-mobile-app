import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Clock from './src/components/Clock';
import { Colors } from './src/constants/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Clock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    // Safe area is handled by expo-status-bar; no extra padding needed.
    ...(Platform.OS === 'android' && { paddingTop: 0 }),
  },
});
