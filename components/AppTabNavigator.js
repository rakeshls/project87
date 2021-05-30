import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import RequesteItemScreen from '../screens/ExchangeScreen';
import HomeScreen from '../screens/HomeScreen';
import {AppStackNavigator} from './AppStackNavigator'

export const AppTabNavigator = createBottomTabNavigator({
   HomeScreen: {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/home.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "List",
    }
  },
  RequesteItem: {
    screen: RequesteItemScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/exchange.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Exchange",
    }
  }
});