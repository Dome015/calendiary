import { StyleSheet, View, StatusBar } from 'react-native';
import * as db from './db/database';
import React, { useEffect, useState } from 'react';
import CalendarList from './components/CalendarList';
import PageContext from './context/PageContext';
import AddEventForm from './components/AddEventForm';
import { BackHandler } from 'react-native';
import { getDateString } from './common';

export default function App() {

  const [page, setPage] = useState("home");
  const [addEventDate, setAddEventDate] = useState(getDateString(new Date()));

  const routes = {
    "home": {
      backPage: "home",
      contentCallback: () => <CalendarList />,
      backCallback: () => BackHandler.exitApp()
    },
    "addEvent": {
      backPage: "home",
      contentCallback: () => <AddEventForm initialDate={addEventDate} />,
      backCallback: () => setPage("home")
    },
  };

  const getContent = () => {
    switch (page) {
      case "addEvent":
        return <AddEventForm initialDate={addEventDate} />
      case "home":
      default:
        return <CalendarList />;
    }
  }

  useEffect(() => {
    const backHandler = () => {
      routes[page].backCallback();
      return true;
    }
    const backHandlerEventListener = BackHandler.addEventListener("hardwareBackPress", backHandler);
    return () => backHandlerEventListener.remove();
  }, [page]);

  const onStartup = async () => {
    await db.initDatabase();
  }

  useEffect(() => {
    onStartup();
  }, []);

  return (
    <PageContext.Provider value={{ setPage: (p) => { setPage(p); console.log("Navigating to " + p); } }}>
      <View style={styles.container}>
        <View style={styles.contentView}>{getContent()}</View>
        <View style={[styles.footerView, styles.elevation]}></View>
      </View>
    </PageContext.Provider>
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
