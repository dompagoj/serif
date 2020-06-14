import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { FilePickerScreen } from '../screens/FilePickerScreen';
import { QrScanScreen } from '../screens/QrScanScreen';
import { UploadingScreen } from '../screens/UploadingScreen';

const Stack = createStackNavigator();

export const MainRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="file-picker" component={FilePickerScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="scanner" component={QrScanScreen} options={{ title: 'Scan QR' }} />
      <Stack.Screen name="uploader" component={UploadingScreen} options={{ title: 'Uploading' }} />
    </Stack.Navigator>
  );
};
