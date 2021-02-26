import React from "react";
import { View, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import BookRequestScreen from '../Screens/BookRequestScreen';
import BookDonateScreen from '../Screens/BookDonateScreen';

export const AppTabNavigator = createBottomTabNavigator({
    BookDonateScreen: {screen: BookDonateScreen,
    navigationOptions: {
        tabBarIcon: <Image source={require("../assets/request-list.png")} style={{width: 40, height: 40}} />,
        tabBarLabel: "Donate Book"
    }},
    BookRequestScreen: {screen: BookRequestScreen,
    navigationOptions: {
        tabBarIcon: <Image source={require("../assets/request-book.png")} style={{width: 40, height: 40}} />,
        tabBarLabel: "Request Book"
    }}
})