import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Input, Overlay, Button, Slider } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { CHAR_CREATE, CHAR_DEL, CHAR_ATRB } from '../lib/redux/actions/charActions'
import { PLAY_TEXT } from '../utils/string'
import { AntDesign } from '@expo/vector-icons'

const CharacterScreen = () => {
    const dispatch = useDispatch()
    const TEXT = PLAY_TEXT()
    const charState = useSelector(state => state.char)
    const [showInput, setShowInput] = useState(false)
    const [name, setName] = useState('')

    const AtrbCard = ({title, value, add}) => (
        <View style={styles.atrb}>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 16}}>{title}</Text>  
            </View>
            
            <View style={{flex: 2, alignItems: 'center'}}>
                <Text style={{fontSize: 16}}>{value}</Text>
            </View>
            {charState.skillPoint > 0 &&
            <TouchableOpacity style={{position:'absolute', right: 0}} onPress={add}>
                <AntDesign name='plus' size={25} />
            </TouchableOpacity>
            }
        </View>
    )

    return <View> 
        {charState != null &&
            <View>
                <View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 35,marginTop: 10}}>{charState.name}</Text>
                        <Text style={{fontSize: 20}}>{TEXT.level} {charState.lvl}</Text>
                    </View>

                    <View>
                        <Text style={{position: 'absolute', right: 10}}>{charState.exp} / {charState.lvlupExp}</Text>

                        <Slider
                            trackStyle={{ height: 5 }}
                            style={{ marginHorizontal: 10 }}
                            minimumTrackTintColor={'gold'}
                            thumbStyle={{ height: 0, width: 0 }}
                            disabled
                            minimumValue={0}
                            maximumValue={charState.lvlupExp}
                            value={charState.exp}
                        />
                    </View>

                    <View style={styles.atrbContainer}>
                        <AtrbCard
                            title={TEXT.hp}
                            value={charState.hp}
                            add={() => dispatch(CHAR_ATRB('hp'))}
                        />
                        <AtrbCard
                            title={TEXT.atk}
                            value={charState.atk}
                            add={() => dispatch(CHAR_ATRB('atk'))}
                        />
                        <AtrbCard
                            title={TEXT.def}
                            value={charState.def}
                            add={() => dispatch(CHAR_ATRB('def'))}
                        />
                        <AtrbCard
                            title={TEXT.agi}
                            value={charState.agi}
                            add={() => dispatch(CHAR_ATRB('agi'))}
                        />
                    </View>

                    <Text style={styles.skill}>{TEXT.skill_point}: {charState.skillPoint}</Text>
                </View>
                

                <Button
                    title={TEXT.delete_character}
                    containerStyle={{margin: 50}}
                    type='clear'
                    onPress={() => {
                        Alert.alert( `${TEXT.delete_character} ?`, TEXT.you_sure_want_to_delete, [
                            {
                                text: TEXT.no,
                                onPress: () => {}
                            },
                            {
                                text: TEXT.yes,
                                onPress: () => dispatch(CHAR_DEL())
                            }
                        ])
                    }}
                />
            </View>
        }

        {charState == null &&
            <Button
                title={TEXT.create_character}
                onPress={() => setShowInput(true)}
            />
        }

        <Overlay isVisible={showInput} onBackdropPress={() => setShowInput(false)}>
            <Input
                placeholder={TEXT.name_character}
                textAlign='center'
                containerStyle={{width: 250}}
                value={name}
                onChangeText={setName}
            />

            <Button
                title={TEXT.create}
                onPress={() => {
                    setShowInput(false)
                    dispatch(CHAR_CREATE(name))
                }}
            />
        </Overlay>
    </View>
}

const styles = StyleSheet.create({
    atrb: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        padding: 10, 
        marginTop: 10,
        marginHorizontal: 10
    },
    atrbContainer: {
        margin: 10, 
        borderWidth: 1, 
        paddingBottom: 10, 
        borderColor: '#dedede', 
        borderRadius: 7
    },
    skill: {
        alignSelf: 'flex-end', 
        marginRight: 10
    }

})

export default CharacterScreen