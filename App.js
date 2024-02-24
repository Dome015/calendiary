import { StyleSheet, View } from 'react-native';
import * as db from './db/database';
import React, { useEffect, useState } from 'react';
import CalendarList from './components/CalendarList';
import AddEventForm from './components/AddEventForm';
import { NavigationContainer } from '@react-navigation/native';
import Footer from './components/Footer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PushNotification, { Importance } from 'react-native-push-notification';
import CalendarDateContext from './contexts/CalendarDateContext';

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

  const [calendarDate, setCalendarDate] = useState(new Date());

  const onStartup = async () => {
    await db.initDatabase();
  }

  useEffect(() => {
    onStartup();
  }, []);

  return (

    <CalendarDateContext.Provider value={{ value: calendarDate, setValue: setCalendarDate }} >
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false, animationEnabled: true }} tabBar={props => <Footer {...props} />} >
            <Tab.Screen
              name="Home"
              component={CalendarList}

              options={{ date: new Date() }}
            />
            <Tab.Screen
              name="AddEvent"
              component={AddEventForm}
              options={{ date: new Date() }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </CalendarDateContext.Provider>


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
