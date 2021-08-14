import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { LOAD } from '../../lib/redux/actions/playActions'

const HomeScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const bookShelf = useSelector(reducer => reducer.shelf)

    return <View style={styles.container}>
        <FlatList
            data={bookShelf}
            keyExtractor={(data,i) => data.name + i}
            renderItem={({item}) => (
                <Button
                    title={item.name}
                    onPress={() => {
                        dispatch(LOAD(item))
                        navigation.navigate('Story', {name: item.name})}
                    }
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