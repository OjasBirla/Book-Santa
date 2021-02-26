import React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from "react-navigation-stack";
import BookDonateScreen from '../Screens/BookDonateScreen';
import ReciverDetailsScreen from '../Screens/ReciverDetailsScreen';

export const AppStackNaviagator = createStackNavigator({
    bookDonateList: {screen: BookDonateScreen,
    navigationOptions: {
        headerShown: false
    }},

    reciverDetails: {screen: ReciverDetailsScreen,
    navigationOptions: {
        headerShown: false
    }}
},
{
    initialRouteName: "bookDonateList",
})