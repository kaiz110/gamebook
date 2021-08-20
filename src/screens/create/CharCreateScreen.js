import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Overlay, Input, Button, Divider } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import delWarn from '../../components/delWarn'
import { ADD_CHAR, DEL_SUB_CHAR } from '../../lib/redux/actions/createActions'
import { SCREEN_WIDTH } from '../../utils/constant'
import { Entypo } from '@expo/vector-icons'
import { CREATE_TEXT } from '../../utils/string'

const CharCreateScreen = () => {
    const TEXT = CREATE_TEXT()
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
        setLvl(1)
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

    const renderCard = ({item}) => (
        <View style={styles.cardContainer}>
            <View style={{flex: 5}}>
                <View style={styles.nameIdCon}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.id} >ID {item.id}</Text> 
                </View>
                
                <View style={styles.lvlExpCon}>
                    <Text>{TEXT.level} {item.lvl}</Text>
                    <Text>{TEXT.exp} : {item.exp}</Text>
                </View>

                <View style={styles.atrbCon}>
                    <View style={styles.atrbChildCon}>
                        <Text>{TEXT.hp}: {item.hp}</Text>
                        <Text>{TEXT.atk}: {item.atk}</Text>
                    </View>
                    
                    <View style={styles.atrbChildCon}>
                        <Text>{TEXT.def}: {item.def}</Text>
                        <Text>{TEXT.agi}: {item.agi}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.trash} onPress={() => delWarn( () => dispatch(DEL_SUB_CHAR(item)) )}>
                <Entypo name='trash' size={29}/>
            </TouchableOpacity>
        </View>
    )

    return <View style={{flex: 1}}>
        <Button
            title={TEXT.add}
            type='outline'
            containerStyle={{margin: 10}}
            onPress={() => setShowAdd(true)}
        />

        <Divider/>

        <FlatList
            data={book.characters}
            keyExtractor={(data,i) => data.id + i}
            renderItem={renderCard}
        />

        <Overlay isVisible={showAdd} onBackdropPress={onCancel}>
            <View style={{width: SCREEN_WIDTH * 0.75, margin: 10}}>
                <ScrollView>
                    <Input
                        placeholder={TEXT.name}
                        inputContainerStyle={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <View>
                        <Input
                            placeholder={TEXT.id_placeholder}
                            inputContainerStyle={styles.input}
                            value={id}
                            onChangeText={setId}
                            keyboardType='numeric'
                            maxLength={3}
                        />

                        {idDup &&
                        <Text style={{position: 'absolute',bottom: 0, alignSelf: 'center',color: 'red'}}>Id is duplicate</Text>}
                    </View>

                    <Divider/>

                    <Text style={{fontSize: 17, alignSelf: 'center', margin: 10}}>{TEXT.level} {lvl}</Text>

                    <Input
                        placeholder={TEXT.hp}
                        inputContainerStyle={styles.input}
                        value={hp}
                        onChangeText={setHp}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder={TEXT.atk}
                        inputContainerStyle={styles.input}
                        value={atk}
                        onChangeText={setAtk}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder={TEXT.def}
                        inputContainerStyle={styles.input}
                        value={def}
                        onChangeText={setDef}keyboardType='numeric'
                    />
                    <Input
                        placeholder={TEXT.agi}
                        inputContainerStyle={styles.input}
                        value={agi}
                        onChangeText={setAgi}
                        keyboardType='numeric'
                    />
                    <Input
                        placeholder={TEXT.exp_can_get}
                        inputContainerStyle={styles.input}
                        value={exp}
                        onChangeText={setExp}
                        keyboardType='numeric'
                    />
                    <Button
                        title={TEXT.save}
                        disabled={notPass}
                        onPress={() => {
                            dispatch(ADD_CHAR(name, id, lvl, hp, atk, def, agi, exp))
                            onCancel()
                        }}
                    />
                </ScrollView>
            </View>
        </Overlay>
    </View>
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row', 
        borderWidth: 1, 
        borderColor: '#dedede',
        borderRadius: 7, 
        margin: 10
    },
    nameIdCon: {
        flexDirection: 'row', 
        margin: 5, 
        marginHorizontal: 10
    },
    name: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginRight: 10, 
        flex: 5
    },
    id: {
        height: 29,
        padding: 5, 
        backgroundColor: 'cornflowerblue', 
        borderRadius: 15, 
        fontWeight: 'bold', 
        color: 'white', 
        flex: 1
    },
    lvlExpCon: {
        flexDirection: 'row', 
        justifyContent: 'space-around'
    },
    atrbCon: {
        borderWidth: 1,
        borderColor: '#d1d1d1',
        borderRadius: 5, 
        padding: 5, 
        margin: 10
    },
    atrbChildCon: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly'
    },
    trash: {
        flex: 1, 
        borderLeftWidth: 1,
        borderColor: '#dedede', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    input: {
        borderBottomWidth: 0, 
        backgroundColor: '#ebebeb' ,
        borderRadius: 5, 
        paddingHorizontal: 5,
    }
})

export default CharCreateScreen