import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

const mock = [
    {
        name: 'First One'
    }
]

const HomeScreen = ({navigation}) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    return <View style={styles.container}>
        <FlatList
            data={mock}
            keyExtractor={data => data.name}
            renderItem={({item}) => (
                <Button
                    title={item.name}
                    onPress={() => navigation.navigate('Story', {name: item.name})}
                />
            )}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 45,
        fontWeight: 'bold',
        marginBottom: 25
    }
})

export default HomeScreen