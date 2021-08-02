import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'
import StoryScreen from '../screens/StoryScreen'
import CharacterScreen from '../screens/CharacterScreen'
import BattleScreen from '../screens/BattleScreen'

const Stack = createStackNavigator()

const Route = () => (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
            <Stack.Screen name='Home' component={HomeScreen}/>
            <Stack.Screen name='Story' component={StoryScreen}/>
            <Stack.Screen name='Character' component={CharacterScreen}/>
            <Stack.Screen name='Battle' component={BattleScreen} options={{ gestureEnabled: false }}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Route