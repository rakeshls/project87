import React from 'react'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {AppTabNavigator}from './AppTabNavigator'
import SettingScreen from '../screens/SettingScreen'
import CSBMenu from './CSBMenu'
import MyBartersScreen from '../screens/MyBarters'
import NotificationScreen from '../screens/NotifcationScreen'
export const AppDrawerNavigator=createDrawerNavigator({
Home:{
    screen:AppTabNavigator
},
Setting:{
    screen:SettingScreen
},
MyBarters:{
    screen:MyBartersScreen
},
Notifications:{
    screen:NotificationScreen
}
},
{
    contentComponent:CSBMenu
},
{initialRouteName:'Home'
})