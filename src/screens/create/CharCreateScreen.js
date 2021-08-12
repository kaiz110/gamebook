import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native'
import { Overlay, Input, Button } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { ADD_CHAR } from '../../lib/redux/actions/createActions'
import { SCREEN_WIDTH } from '../../utils/constant'

const CharCreateScreen = () => {
    const state = useSelector(reducer => reducer.create)
    const book = useMemo(() => state.books.find(val => val.name === state.currentBook) ,[ state ]) 
    const dispatch = useDispatch()

    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [lvl, setLvl] = useState(1)
    const [id, setId] = useState('')
    const [hp, setHp] = useState('')
    const [atk, setAtk] = useState('')
    const [def, setDef] = useState('')
    const [agi, setAgi] = useState('')
    const [exp, setExp] = useState('')
    const [notPass, setNotPass] = useState(true)
    const [idDup, setIdDup] = useState(false)

    useEffect(() => {
        const hplv = Math.floor( Math.max(0, (+hp - 80)) / 50 )
        const atrlv = Math.max(0,(+atk + +def + +agi) - 10)
        const nan = isNaN(hplv + atrlv)
        setLvl(!nan ? 1 + hplv + atrlv : 1)

        requirement()
    },[hp, atk, def, agi, exp])

    useEffect(() => {
        const sameId = book.characters.find(val => val.id === id)
        if(sameId != undefined) {
            setNotPass(true)
            setIdDup(true)
        }
        else {
            requirement()
            setIdDup(false)
        }
    }, [ id ])

    const requirement = () => {
        const test = (atr) => /^\d+$/.test(atr)
        const idL = /^\d{3}$/.test(id)
        if(test(hp) && test(atk) && test(def) && test(agi) && test(exp) && name !== '' && idL) setNotPass(false)
        else setNotPass(true)
    }

    const onCancel = () => {
        setName('')
        setLv(1)
        setId('')
        setHp('')
        setAtk('')
        setDef('')
        setAgi('')
        setExp('')
        setNotPass(true)
        setIdDup(false)
        setShowAdd(false)
    }

    return <View>
        <Text>CHar create</Text>
        <Button
            title='Add'
            onPress={() => setShowAdd(true)}
        />

        <FlatList
            data={book.characters}
            keyExtractor={data => data.id}
            renderItem={({item}) => {
                return <View>
                    <Text>{item.name} - lvl {item.lvl} - id [{item.id}]</Text>
                </View>
            }}
        />

        <Overlay isVisible={showAdd} onBackdropPress={() => setShowAdd(false)}>
            <View style={{width: SCREEN_WIDTH * 0.75, margin: 10}}>
                <ScrollView>
                    <Input
                        placeholder='name'
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        placeholder='id ( 000 - 999 )'
                        value={id}
                        onChangeText={setId}
                        keyboardType='numeric'
                        maxLength={3}
                    />

                    {idDup &&
                    <Text>Id is duplicate</Text>}

                    <Text>Lvl {lvl}</Text>

                    <Input
                        placeholder='hp'
                        value={hp}
                        onChangeText={setHp}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder='atk'
                        value={atk}
                        onChangeText={setAtk}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder='def'
                        value={def}
                        onChangeText={setDef}keyboardType='numeric'
                    />
                    <Input
                        placeholder='agi'
                        value={agi}
                        onChangeText={setAgi}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder='exp'
                        value={exp}
                        onChangeText={setExp}
                        keyboardType='numeric'
                    />
                    <Button
                        title='Save'
                        disabled={notPass}
                        onPress={() => {
                            dispatch(ADD_CHAR(name, id, lvl, hp, atk, def, agi, exp))
                            setShowAdd(false)
                        }}
                    />
                </ScrollView>
            </View>
        </Overlay>
    </View>
}

const styles = StyleSheet.create({})

export default CharCreateScreen