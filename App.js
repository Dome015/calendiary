import { StyleSheet, View } from 'react-native';
import * as db from './db/database';
import React, { useEffect } from 'react';
import CalendarList from './components/CalendarList';
import AddEventForm from './components/AddEventForm';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  const onStartup = async () => {
    await db.initDatabase();
  }

  useEffect(() => {
    onStartup();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={CalendarList}
            options={{ date: new Date() }}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEventForm}
            options={{ date: new Date() }}
          />
        </Stack.Navigator>
      </NavigationContainer>  
      </View>
      <View style={[styles.footerView, styles.elevation]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ededed",
    display: "flex",
    flexDirection: "column"
  },
  contentView: {
    width: "100%",
    flex: 0.925
  },
  footerView: {
    backgroundColor: "white",
    flex: 0.075
  },
  elevation: {
    elevation: 10,
    shadowColor: "black"
  }
});
