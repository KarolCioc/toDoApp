import 'react-native-gesture-handler';
import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from './components/Stack';
import * as Notifications from 'expo-notifications';
import { UserProvider } from './components/UserContext';

export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  return (
      <UserProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <StackNav/>
          </NavigationContainer>
        </NativeBaseProvider>
      </UserProvider>
  );
}