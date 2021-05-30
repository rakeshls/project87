import React from 'react'
import {createStackNavigator} from 'react-navigation-stack'
import HomeScreen from '../screens/HomeScreen'
import RecvDetailsScreen from '../screens/RecvDetailsScreen'
export const AppStackNavigator = createStackNavigator({
    BookDonateList:{
        screen:HomeScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    BookRecverDetails:{
        screen:RecvDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    },
},
    {
        initialRouteName:'BookDonateList'
    }
)