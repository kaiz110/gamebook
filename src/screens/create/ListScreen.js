import React, { useLayoutEffect, useState, useMemo } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Overlay, Input, Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import { SCREEN_WIDTH } from '../../utils/constant'
import { ADD_PROJECT, CURRENT, DEL_PROJECT } from '../../lib/redux/actions/createActions'
import { FlatList } from 'react-native'
import delWarn from '../../components/delWarn'
import { CREATE_TEXT } from '../../utils/string'

const ListScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const TEXT = CREATE_TEXT()
    const books = useSelector(reducer => reducer.create.books)
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [summary, setSummary] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: TEXT.create_story,
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
            contentContainerStyle={{paddingBottom: 10}}
            renderItem={({item}) => (
                <Button
                    title={item.name}
                    buttonStyle={styles.bookCard}
                    onLongPress={() => delWarn( () => dispatch(DEL_PROJECT(item)) )}
                    onPress={() => {
                        dispatch(CURRENT(item.name))
                        navigation.navigate('Detail')}
                    }
                />
            )}
        />

        <Overlay isVisible={showAdd} onBackdropPress={() => setShowAdd(false)}>
            <View style={{width: SCREEN_WIDTH * 0.85}}>
                <Text style={styles.newTitle}>{TEXT.add_a_story}</Text>

                <Input
                    placeholder={TEXT.name}
                    inputContainerStyle={styles.newInput}
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    placeholder={TEXT.summary}
                    textAlignVertical='top'
                    multiline
                    style={{height: 125}}
                    numberOfLines={5}
                    inputContainerStyle={styles.newInput}
                    value={summary}
                    onChangeText={setSummary}
                />

                <Button
                    title={TEXT.add}
                    containerStyle={{marginTop: 0, margin: 10}}
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

const styles = StyleSheet.create({
    bookCard: {
        paddingVertical: 15,
        borderRadius: 10,
        margin: 10, 
        marginBottom: 0,
        backgroundColor: 'sienna'
    },
    newTitle: {
        fontWeight: 'bold', 
        fontSize: 24, 
        margin: 10, 
        marginTop: 0,
        alignSelf: 'center'
    },
    newInput: {
        borderBottomWidth: 0, 
        backgroundColor: '#ebebeb' ,
        borderRadius: 5, 
        padding: 5,
    }
})

export default ListScreen