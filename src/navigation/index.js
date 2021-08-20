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
import CharCreateScreen from '../screens/create/CharCreateScreen'

import { Entypo } from '@expo/vector-icons'

const Stack = createStackNavigator()
const SubStack = createStackNavigator()
const BottomTab = createBottomTabNavigator()

const Home = () => (
    <SubStack.Navigator>
        <SubStack.Screen name='Home' component={HomeScreen} options={{headerTitleAlign: 'center', title: 'Gamebook'}}/>
    </SubStack.Navigator>
)

const List = () => (
    <SubStack.Navigator>
        <SubStack.Screen name='List' component={ListScreen} options={{headerTitleAlign: 'center', title: 'Create'}}/>
    </SubStack.Navigator>
)

const Tab = () => (
    <BottomTab.Navigator tabBarOptions={{showLabel: false}}>
        <BottomTab.Screen name='HomeT' 
            component={Home} 
            options={{
                tabBarIcon: ({focused,color, size}) => (
                    <Entypo name='controller-play' color={color} size={focused?size+6:size}/>
                )
            }}/>
        <BottomTab.Screen name='ListT' 
            component={List}
            options={{
                tabBarIcon: ({focused,color, size}) => {
                    return <Entypo name='pencil' color={color} size={focused?size+5:size}/>
                }
            }}/>
    </BottomTab.Navigator>
)

const Route = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Tab' component={Tab} options={{headerShown: false}}/>

            <Stack.Screen name='Story' component={StoryScreen}/>
            <Stack.Screen name='Character' component={CharacterScreen}/>
            <Stack.Screen name='Battle' component={BattleScreen} options={{ gestureEnabled: false }}/>

            <Stack.Screen name='Page' component={PageScreen}/>
            <Stack.Screen name='Detail' component={DetailScreen}/>
            <Stack.Screen name='CharCreate' component={CharCreateScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Route