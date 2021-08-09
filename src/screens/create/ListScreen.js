import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Overlay, Input, Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import { SCREEN_WIDTH } from '../../utils/constant'
import { ADD_PROJECT, CURRENT } from '../../lib/redux/actions/createActions'
import { FlatList } from 'react-native'

const ListScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const books = useSelector(reducer => reducer.create.books)
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [summary, setSummary] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setShowAdd(true)}>
                    <Feather name='plus' size={27} color='black' style={{margin: 7}}/>
                </TouchableOpacity>
            )
        })
    },[ navigation ])

    return <View>
        <FlatList
            data={books}
            keyExtractor={data => data.name}
            renderItem={({item}) => (
                <Button
                    title={item.name}
                    onPress={() => {
                        dispatch(CURRENT(item.name))
                        navigation.navigate('Detail')}
                    }
                />
            )}
        />

        <Overlay isVisible={showAdd} onBackdropPress={() => setShowAdd(false)}>
            <View style={{width: SCREEN_WIDTH * 0.7}}>
                <Input
                    placeholder='Here Name'
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    placeholder='here sum'
                    textAlignVertical='top'
                    multiline
                    style={{height: 125}}
                    numberOfLines={5}
                    value={summary}
                    onChangeText={setSummary}
                />

                <Button
                    title='Them'
                    onPress={() => {
                        const f = books.find(val => val.name === name)
                        if(f == undefined) dispatch(ADD_PROJECT({name, summary}))
                        setShowAdd(false)
                        setName('')
                        setSummary('')
                    }}
                />
            </View>
        </Overlay>
    </View>
}

const styles = StyleSheet.create({})

export default ListScreen