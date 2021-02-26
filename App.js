import React from 'react';
import { StyleSheet, View } from 'react-native';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import LogIn from './Screens/LogIn';

import { AppDrawerNavigator } from "./Component/AppDrawerNavigator";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AppContainer />
      </View>
    );
  }
}

const SwitchNavigator = createSwitchNavigator({
  LogIn: {screen: LogIn},
  Drawer: {screen: AppDrawerNavigator},
});

const AppContainer = createAppContainer(SwitchNavigator);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
