import { StyleSheet, View } from 'react-native';
import * as db from './db/database';
import React, { useEffect, useState } from 'react';
import CalendarList from './components/CalendarList';
import { NavigationContainer } from '@react-navigation/native';
import Footer from './components/Footer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PushNotification, { Importance } from 'react-native-push-notification';
import Settings from './components/Settings';
import LocationContext from './contexts/SettingsContext';

PushNotification.configure({
  onNotification: notification => {
    console.log("Notification: ", notification);
    // process the notification
  },
  requestPermissions: false
});

PushNotification.channelExists("calendiary", exists => {
  if (exists) {
    console.log("Notification channel already exists")
    return;
  }
  PushNotification.createChannel(
    { channelId: "calendiary", channelName: "calendiary", importance: Importance.HIGH },
    channel => console.log("Notification channel created")
  );

});

const Tab = createBottomTabNavigator();

export default function App() {

  const [location, setLocation] = useState("US");
  const [timeFormat, setTimeFormat] = useState("12");

  const onStartup = async () => {
    await db.initDatabase();
    const dbLocation = await db.getSettingByName("location");
    setLocation(dbLocation.value);
    const dbTimeLocation = await db.getSettingByName("timeFormat");
    setTimeFormat(dbTimeLocation.value);
  }

  useEffect(() => {
    onStartup();
  }, []);

  return (
    <LocationContext.Provider value={{ location: location, setLocation: setLocation, timeFormat: timeFormat, setTimeFormat: setTimeFormat }}>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false, animationEnabled: true }} tabBar={props => <Footer {...props} />} >
            <Tab.Screen
              name="Home"
              component={CalendarList}
              options={{ date: new Date() }}
            />
            <Tab.Screen
              name="Settings"
              component={Settings}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </LocationContext.Provider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ededed",
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
});
