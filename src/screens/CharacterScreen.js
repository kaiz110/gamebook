import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Input, Overlay, Button } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { CHAR_CREATE, CHAR_DEL, CHAR_ATRB } from '../lib/redux/actions/charActions'
import { PLAY_TEXT } from '../utils/string'

const CharacterScreen = () => {
    const dispatch = useDispatch()
    const TEXT = PLAY_TEXT()
    const charState = useSelector(state => state.char)
    const [showInput, setShowInput] = useState(false)
    const [name, setName] = useState('')

    return <View> 
        {charState != null &&
            <View>
                <View>
                    <Text>{TEXT.name}: {charState.name}</Text>
                    <Text>{TEXT.level}: {charState.lvl}</Text>
                    <Text>{TEXT.hp}: {charState.hp}</Text>
                    <Text>{TEXT.atk}: {charState.atk}</Text>
                    <Text>{TEXT.def}: {charState.def}</Text>
                    <Text>{TEXT.agi}: {charState.agi}</Text>
                    <Text>{TEXT.skill_point}: {charState.skillPoint}</Text>
                    <Text>{TEXT.exp}: {charState.exp} / {charState.lvlupExp}</Text>
                </View>

                {charState.skillPoint > 0 &&
                <View>
                    <Button
                        title='tang mau'
                        onPress={() => dispatch(CHAR_ATRB('hp'))}
                    />
                    <Button
                        title='tang atk'
                        onPress={() => dispatch(CHAR_ATRB('atk'))}
                    />
                    <Button
                        title='tang def'
                        onPress={() => dispatch(CHAR_ATRB('def'))}
                    />
                    <Button
                        title='tang agi'
                        onPress={() => dispatch(CHAR_ATRB('agi'))}
                    />
                </View>}
                

                <Button
                    title={TEXT.delete_character}
                    onPress={() => dispatch(CHAR_DEL())}
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

const styles = StyleSheet.create({})

export default CharacterScreen