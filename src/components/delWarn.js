import React from 'react'
import { Alert } from 'react-native'
import { COMPONENT_TEXT } from '../utils/string'

const T = COMPONENT_TEXT()

const delWarn = (onPress) => (
    Alert.alert(T.delete, T.are_you_sure_want_to_delete,[
        {text: T.yes,onPress},
        {text: T.no, onPress: () => {}}
    ], {cancelable: true})
)

export default delWarn