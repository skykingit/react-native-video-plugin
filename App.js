// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoScreen from './src/video'
import VideoControlsScreen from './src/video-player'
import VideoPluginScreen from './src/video-plugin'




const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Video" component={VideoScreen} />
        <Stack.Screen name="VideoControls" component={VideoControlsScreen} />
        <Stack.Screen name="VideoPlugin" component={VideoPluginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;