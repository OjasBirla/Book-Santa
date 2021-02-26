import React from 'react';
import { View} from 'react-native';

import { CustomSidebarMenu } from './CustomSidebarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import { createDrawerNavigator } from 'react-navigation-drawer';

import SettingsScreen from '../Screens/SettingsScreen';
import MyDonationScreen from '../Screens/MyDonationsScreen'
import NotificationScreen from '../Screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
    MyDonations: {screen: MyDonationScreen},
    Notigication: {screen: NotificationScreen},
    Setting: {screen: SettingsScreen},
},
{
    // This is Used to render all the components from customSideBarMenu
    contentComponent: CustomSidebarMenu    
},
{
    // This tells the name of the Route Name that should Be there Initialy 
    initaialRoutName: "Home"
}
)