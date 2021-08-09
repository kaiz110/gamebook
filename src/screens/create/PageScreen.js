import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { Input, Button, Overlay, CheckBox } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { ADD_PAGE } from '../../lib/redux/actions/createActions'
import { SCREEN_WIDTH } from '../../utils/constant'


const PageScreen = ({navigation, route}) => {
    const page = route.params?.page
    const state = useSelector(reducer => reducer.create)
    const book = useMemo(() => state.books.find(val => val.name === state.currentBook) ,[ state ]) 
    const dispatch = useDispatch()
    const [pageNumber, setPageNumber] = useState(null)
    const [substance, setSubstance] = useState(page != undefined ? page.content : '')
    const [choices, setChoices] = useState([])
    const [branch, setBranch] = useState([])
    const [showChoice, setShowChoice] = useState(false) // overlay
    const [type, setType] = useState('') //
    const [twoRoute, setTwoRoute] = useState(null)
    const [atrb, setAtrb] = useState('')

    useEffect(() => {
        if( page == undefined ) {
            let temp = book.story.length + 1
            for(let i = 0 ; i < book.story ; ++i ) {
                if(book.story[i] === temp) {
                    temp = book.story[i] + 1
                    i = 0
                }
            }
            setPageNumber(temp)
        } else {
            setPageNumber(page.page)
        }
    },[ navigation ])

    return <View>
        <Text>page: {pageNumber}</Text>
        <View>
            <Input
                placeholder='content'
                multiline
                value={substance}
                onChangeText={setSubstance}
            />
        </View>

        <Button
            title='add choices'
            onPress={() => setShowChoice(true)}
        />

        <Button
            title='save'
            onPress={() => {
                dispatch(ADD_PAGE(page != undefined,pageNumber, substance, [], []))
                navigation.goBack()
            }}
        />

        <Overlay isVisible={showChoice} onBackdropPress={() => setShowChoice(false)}>
            <View style={{margin: 10, width: SCREEN_WIDTH * 0.85}}>
                <ScrollView >
                    <Input
                        placeholder='Title'
                    />

                    <View style={{flexDirection: 'row'}}>
                        <CtCheckBox
                            title='navigation'
                            checked={type === 'navigation'}
                            onPress={() => setType('navigation')}
                        />
                        <CtCheckBox
                            title='battle'
                            checked={type === 'battle'}
                            onPress={() => setType('battle')}
                        />
                    </View>
                    
                    <View style={{flexDirection: 'row'}}>
                        <CtCheckBox
                            title='fortune'
                            checked={type === 'fortune'}
                            onPress={() => setType('fortune')}
                        />
                        <CtCheckBox
                            title='attribute'
                            checked={type === 'attribute'}
                            onPress={() => setType('attribute')}
                        />
                    </View>

                    <View>
                        {type === 'navigation' &&
                        <View>
                            <Input
                                placeholder='to page'
                            />
                        </View>}


                        {type === 'battle' &&
                        <View>
                            <Input
                                placeholder='battle with (char code)'
                            />

                            <Input
                                placeholder='if win go to'
                            />
                            <Input
                                placeholder='if lose go to'
                            />
                        </View>}

                        {type === 'fortune' &&
                        <View>
                            <CtCheckBox
                                title='2 route'
                                checked={twoRoute}
                                onPress={() => setTwoRoute(true)}
                            />
                            <CtCheckBox
                                title='3 route'
                                checked={!twoRoute}
                                onPress={() => setTwoRoute(false)}
                            />

                            <View>
                                <Input
                                    placeholder='route 1 go to page'
                                />
                                <Input
                                    placeholder='route 2 go to page'
                                />
                                {!twoRoute &&
                                <Input
                                    placeholder='route 3 go to page'
                                />
                                }
                            </View>
                        </View>}

                        {type === 'attribute' &&
                        <View>
                            <CtCheckBox
                                title='attack'
                                checked={atrb === 'atk'}
                                onPress={() => setAtrb('atk')}
                            />
                            <CtCheckBox
                                title='defend'
                                checked={atrb === 'def'}
                                onPress={() => setAtrb('def')}
                            />
                            <CtCheckBox
                                title='agility'
                                checked={atrb === 'agi'}
                                onPress={() => setAtrb('agi')}
                            />

                            <Input
                                placeholder='attribute value'
                            />

                            <Input
                                placeholder='if pass go to '
                            />
                        </View>}
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Button 
                            title='cancel'
                            onPress={() => setShowChoice(false)}
                        />
                        <Button 
                            title='ok'
                            onPress={() => {}}
                        />
                    </View>
                </ScrollView>
            </View>
        </Overlay>
    </View>
}

const CtCheckBox = ({title, checked, onPress}) => (
    <CheckBox
        title={title}
        checked={checked}
        onPress={onPress}
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
    />
)

const styles = StyleSheet.create({})

export default PageScreen