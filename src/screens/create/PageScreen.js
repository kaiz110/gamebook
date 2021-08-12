import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, View, Text, ScrollView,FlatList, TouchableOpacity } from 'react-native'
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
    const [choices, setChoices] = useState(page != undefined ? page.choices : [])
    const [branch, setBranch] = useState(page != undefined ? page.branch : [])
    const [showChoice, setShowChoice] = useState(false) // overlay
    const [type, setType] = useState('') //  navigation, fortune, battle and attribute
    const [twoRoute, setTwoRoute] = useState(true)
    const [atrb, setAtrb] = useState('1')

    const [choiceTitle, setChoiceTitle] = useState('')
    const [navi, setNavi] = useState('')
    const [route1 , setRoute1] = useState('')
    const [route2 , setRoute2] = useState('')
    const [route3 , setRoute3] = useState('')
    const [battleWith, setBattleWith] = useState('')
    const [battleWin, setBattleWin] = useState('')
    const [battleLose, setBattleLose] = useState('')
    const [atrbValue, setAtrbValue] = useState('')
    const [atrbPass, setAtrbPass] = useState('')

    const [errorOverlayText, setErrorOverlayText] = useState('')

    useEffect(() => {
        if( page == undefined ) {
            const pageArr = book.story.map(val => val.page).sort((a, b) => a - b)
            const temp = pageArr.length != 0 ? pageArr[pageArr.length - 1] + 1 : 1
            setPageNumber(temp)
        } else {
            setPageNumber(page.page)
        }
    },[ navigation ])

    const fixN = (num, length) => (new Array(length).join('0') + num).substr(-length)

    const deleteChoice = (choice) => {
        const after = choices.filter(val => val !== choice)
        const bAfter = branch.filter(val => val.slice(0,8) !== choice.slice(0,8))
        setChoices(after)
        setBranch(bAfter)
    }

    const onCreateChoice = () => {
        switch (type) {
            case 'NAVI':
                setChoices([...choices, `NAVI${fixN(navi, 4)}-${choiceTitle}`])
                break
            case 'FTUN':
                const o = twoRoute ? '0' : '1'
                const crFt = choices.filter(val => val.slice(0,4) === 'FTUN')
                const numArr = crFt.map( val => Number(val.slice(5,7)) ).sort((a,b) => a - b)
                let id = 0
                for(let i = 0 ; i < numArr.length ; ++i) {
                    if(id === numArr[i]) id++
                }

                const fcode = `FTUN${o}${fixN(id, 2)}0`
                const b = [`${fcode}SU-${fixN(route1, 4)}`, `${fcode}FA-${fixN(route2, 4)}`]
                if(o==='1') b.push(`${fcode}DR-${fixN(route3, 4)}`)

                setChoices([...choices, `${fcode}-${choiceTitle}`])
                setBranch([...branch, ...b])
                break
            case 'DUEL':
                setChoices([...choices, `DUEL0${fixN(battleWith,3)}-${choiceTitle}`])
                setBranch([...branch, ...[
                    `DUEL0${fixN(battleWith,3)}SU-${fixN(battleWin, 4)}`, 
                    `DUEL0${fixN(battleWith,3)}FA-${fixN(battleLose, 4)}`
                ]])
                break
            case 'ATRB':
                    setChoices([...choices, `ATRB${atrb}${fixN(atrbValue, 3)}-${choiceTitle}`])
                    setBranch([...branch, `ATRB${atrb}${fixN(atrbValue, 3)}-${fixN(atrbPass, 4)}`])
                break
            default:
                break
        }
    }

    const onCancel = () => {
        setChoiceTitle('')
        setNavi('')
        setRoute1('')
        setRoute2('')
        setRoute3('')
        setBattleWith('')
        setBattleWin('')
        setBattleLose('')
        setAtrbValue('')
        setAtrbPass('')
        setErrorOverlayText('')
        setType('')
        setShowChoice(false)
    }

    const isEmpty = () => {
        switch (type) {
            case 'NAVI':
                return navi == '' || choiceTitle == ''
            case 'DUEL':
                return battleWith == '' || battleWin == '' || battleLose == ''|| choiceTitle == ''
            case 'FTUN':
                return route1 == '' || route2 == '' || route3 == ''|| choiceTitle == ''
            case 'ATRB':
                return atrbPass == '' || atrbValue == '' || choiceTitle == ''
            default:
                return true
        }
    }

    return <ScrollView>
        <Text>page: {pageNumber}</Text>
        <View>
            <Input
                placeholder='content'
                multiline
                value={substance}
                onChangeText={setSubstance}
            />
        </View>

        {choices.map((item, idex) => (
            <TouchableOpacity 
                key={item + idex}
                style={{margin: 10, borderWidth: 1, width: SCREEN_WIDTH-20}}
                onPress={() => deleteChoice(item)}
            >
                <Text>{item}</Text>
                {branch.filter(val => val.slice(0,8) === item.slice(0,8)).map((b,i) => {
                    return <Text key={b + i}>{b}</Text>
                })
                }
            </TouchableOpacity>
        ))}

        <View>
            <Button
                title='add choices'
                onPress={() => setShowChoice(true)}
            />

            <Button
                title='save'
                onPress={() => {
                    dispatch(ADD_PAGE(page != undefined,pageNumber, substance, choices, branch))
                    navigation.goBack()
                }}
            />
        </View>

        <Overlay isVisible={showChoice} onBackdropPress={onCancel}>
            <View style={{margin: 10, width: SCREEN_WIDTH * 0.85}}>
                <ScrollView >
                    <Input
                        placeholder='Title'
                        value={choiceTitle}
                        onChangeText={setChoiceTitle}
                    />

                    <View style={{flexDirection: 'row'}}>
                        <CtCheckBox
                            title='navigation'
                            checked={type === 'NAVI'}
                            onPress={() => setType('NAVI')}
                        />
                        <CtCheckBox
                            title='fortune'
                            checked={type === 'FTUN'}
                            onPress={() => setType('FTUN')}
                        />
                    </View>
                    
                    <View style={{flexDirection: 'row'}}>
                        <CtCheckBox
                            title='battle'
                            checked={type === 'DUEL'}
                            onPress={() => setType('DUEL')}
                        />
                        <CtCheckBox
                            title='attribute'
                            checked={type === 'ATRB'}
                            onPress={() => setType('ATRB')}
                        />
                    </View>

                    <View>
                        {type === 'NAVI' &&
                        <View>
                            <Input
                                placeholder='to page'
                                keyboardType='numeric'
                                maxLength={4}
                                value={navi}
                                onChangeText={setNavi}
                            />
                        </View>}


                        {type === 'DUEL' &&
                        <View>
                            <Input
                                placeholder='battle with (char code)'
                                keyboardType='numeric'
                                maxLength={3}
                                value={battleWith}
                                onChangeText={setBattleWith}
                            />

                            <Input
                                placeholder='if win go to'
                                keyboardType='numeric'
                                maxLength={4}
                                value={battleWin}
                                onChangeText={setBattleWin}
                            />
                            <Input
                                placeholder='if lose go to'
                                keyboardType='numeric'
                                maxLength={4}
                                value={battleLose}
                                onChangeText={setBattleLose}
                            />
                        </View>}

                        {type === 'FTUN' &&
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
                                    keyboardType='numeric'
                                    maxLength={4}
                                    value={route1}
                                    onChangeText={setRoute1}
                                />
                                <Input
                                    placeholder='route 2 go to page'
                                    keyboardType='numeric'
                                    maxLength={4}
                                    value={route2}
                                    onChangeText={setRoute2}
                                />
                                {!twoRoute &&
                                <Input
                                    placeholder='route 3 go to page'
                                    keyboardType='numeric'
                                    maxLength={4}
                                    value={route3}
                                    onChangeText={setRoute3}
                                />
                                }
                            </View>
                        </View>}

                        {type === 'ATRB' &&
                        <View>
                            <CtCheckBox
                                title='attack'
                                checked={atrb === '1'}
                                onPress={() => setAtrb('1')}
                            />
                            <CtCheckBox
                                title='defend'
                                checked={atrb === '2'}
                                onPress={() => setAtrb('2')}
                            />
                            <CtCheckBox
                                title='agility'
                                checked={atrb === '3'}
                                onPress={() => setAtrb('3')}
                            />

                            <Input
                                placeholder='attribute value'
                                keyboardType='numeric'
                                maxLength={3}
                                value={atrbValue}
                                onChangeText={setAtrbValue}
                            />

                            <Input
                                placeholder='if pass go to '
                                keyboardType='numeric'
                                maxLength={4}
                                value={atrbPass}
                                onChangeText={setAtrbPass}
                            />
                        </View>}
                    </View>
                    
                    <View>
                        <Text style={{color: 'red', fontWeight: 'bold'}}>{errorOverlayText}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Button 
                            title='cancel'
                            onPress={onCancel}
                        />
                        <Button 
                            title='ok'
                            disabled={isEmpty()}
                            onPress={() => {
                                const h = choices.find(val => {
                                    const na = val.substr(0,8) === `${type}${fixN(navi, 4)}`
                                    const du = val.substr(0,8) === `${type}0${fixN(battleWith,3)}`
                                    const at = val.substr(0,8) === `${type}${atrb}${fixN(atrbValue, 3)}`
                                    const split = type === 'NAVI' ? na : type === 'DUEL' ? du : type === 'ATRB' ? at : false
                                    return  split
                                })
                                if(h != undefined && type !== 'FTUN') setErrorOverlayText('Đã tồn tại')
                                else {
                                    onCreateChoice()
                                    onCancel()
                                }
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        </Overlay>
    </ScrollView>
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