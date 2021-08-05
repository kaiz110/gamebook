import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import HomeScreen from '../screens/play/HomeScreen'
import StoryScreen from '../screens/play/StoryScreen'
import CharacterScreen from '../screens/play/CharacterScreen'
import BattleScreen from '../screens/play/BattleScreen'

import ListScreen from '../screens/create/ListScreen'
import DetailScreen from '../screens/create/DetailScreen'
import PageScreen from '../screens/create/PageScreen'

const Stack = createStackNavigator()
const BottomTab = createBottomTabNavigator()

const Tab = () => (
    <BottomTab.Navigator>
        <BottomTab.Screen name='Home' component={HomeScreen}/>
        <BottomTab.Screen name='List' component={ListScreen}/>
    </BottomTab.Navigator>
)

const Route = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Tab' component={Tab} options={{headerTitleAlign: 'center', title: 'GameBook'}}/>
            <Stack.Screen name='Story' component={StoryScreen}/>
            <Stack.Screen name='Character' component={CharacterScreen}/>

            <Stack.Screen name='Battle' component={BattleScreen} options={{ gestureEnabled: false }}/>
            <Stack.Screen name='Page' component={PageScreen}/>
            <Stack.Screen name='Detail' component={DetailScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Route