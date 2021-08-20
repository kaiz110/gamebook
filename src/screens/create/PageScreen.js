import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Input, Button, Overlay, CheckBox, Divider } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import delWarn from '../../components/delWarn'
import openImage from '../../components/openImage'
import { ADD_PAGE } from '../../lib/redux/actions/createActions'
import { CODE, SCREEN_WIDTH } from '../../utils/constant'
import { CREATE_TEXT } from '../../utils/string'


const PageScreen = ({ navigation, route }) => {
    const page = route.params?.page
    const state = useSelector(reducer => reducer.create)
    const TEXT = CREATE_TEXT()
    const book = useMemo(() => state.books.find(val => val.name === state.currentBook), [state])
    const dispatch = useDispatch()
    const [pageNumber, setPageNumber] = useState(null)
    const [substance, setSubstance] = useState(page != undefined ? page.content : '')
    const [choices, setChoices] = useState(page != undefined ? page.choices : [])
    const [branch, setBranch] = useState(page != undefined ? page.branch : [])
    const [image, setImage] = useState(page != undefined ? page.image : '')
    const [showChoice, setShowChoice] = useState(false) // overlay
    const [type, setType] = useState('') //  navigation, fortune, battle and attribute
    const [twoRoute, setTwoRoute] = useState(true)
    const [atrb, setAtrb] = useState('1')

    const [choiceTitle, setChoiceTitle] = useState('')
    const [navi, setNavi] = useState('')
    const [route1, setRoute1] = useState('')
    const [route2, setRoute2] = useState('')
    const [route3, setRoute3] = useState('')
    const [battleWith, setBattleWith] = useState('')
    const [battleWin, setBattleWin] = useState('')
    const [battleLose, setBattleLose] = useState('')
    const [atrbValue, setAtrbValue] = useState('')
    const [atrbPass, setAtrbPass] = useState('')

    const [errorOverlayText, setErrorOverlayText] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${TEXT.page} ${pageNumber}`
        })
    }, [navigation, pageNumber])

    useEffect(() => {
        if (page == undefined) {
            const pageArr = book.story.map(val => val.page).sort((a, b) => a - b)
            const temp = pageArr.length != 0 ? pageArr[pageArr.length - 1] + 1 : 1
            setPageNumber(temp)
        } else {
            setPageNumber(page.page)
        }
    }, [navigation])

    const fixN = (num, length) => (new Array(length).join('0') + num).substr(-length)

    const deleteChoice = (choice) => {
        const after = choices.filter(val => val !== choice)
        const bAfter = branch.filter(val => val.slice(0, 8) !== choice.slice(0, 8))
        setChoices(after)
        setBranch(bAfter)
    }

    const onCreateChoice = () => {
        switch (type) {
            case CODE.NAVI:
                setChoices([...choices, `${CODE.NAVI}${fixN(navi, 4)}-${choiceTitle}`])
                break
            case CODE.FTUN:
                const o = twoRoute ? '0' : '1'
                const crFt = choices.filter(val => val.slice(0, 4) === CODE.FTUN) // current ftun
                const numArr = crFt.map(val => Number(val.slice(5, 7))).sort((a, b) => a - b) //ids
                let id = 0
                for (let i = 0; i < numArr.length; ++i) {
                    if (id === numArr[i]) id++
                }

                const fcode = `${CODE.FTUN}${o}${fixN(id, 2)}0`
                const b = [`${fcode}${CODE.SU}-${fixN(route1, 4)}`, `${fcode}${CODE.FA}-${fixN(route2, 4)}`]
                if (o === '1') b.push(`${fcode}${CODE.FA}-${fixN(route3, 4)}`)

                setChoices([...choices, `${fcode}-${choiceTitle}`])
                setBranch([...branch, ...b])
                break
            case CODE.DUEL:
                setChoices([...choices, `${CODE.DUEL}0${fixN(battleWith, 3)}-${choiceTitle}`])
                setBranch([...branch, ...[
                    `${CODE.DUEL}0${fixN(battleWith, 3)}${CODE.SU}-${fixN(battleWin, 4)}`,
                    `${CODE.DUEL}0${fixN(battleWith, 3)}${CODE.FA}-${fixN(battleLose, 4)}`
                ]])
                break
            case CODE.ATRB:
                setChoices([...choices, `${CODE.ATRB}${atrb}${fixN(atrbValue, 3)}-${choiceTitle}`])
                setBranch([...branch, `${CODE.ATRB}${atrb}${fixN(atrbValue, 3)}-${fixN(atrbPass, 4)}`])
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
            case CODE.NAVI:
                return navi == '' || choiceTitle == ''
            case CODE.DUEL:
                return battleWith == '' || battleWin == '' || battleLose == '' || choiceTitle == ''
            case CODE.FTUN:
                if (twoRoute) return route1 == '' || route2 == '' || choiceTitle == ''
                return route1 == '' || route2 == '' || route3 == '' || choiceTitle == ''
            case CODE.ATRB:
                return atrbPass == '' || atrbValue == '' || choiceTitle == ''
            default:
                return true
        }
    }
    const typeFilter = (item) => {
        switch (item.slice(0, 4)) {
            case CODE.NAVI:
                return TEXT.navigation
            case CODE.DUEL:
                return TEXT.battle
            case CODE.ATRB:
                return TEXT.attribute
            case CODE.FTUN:
                return TEXT.fortune
            default:
                return ''
        }
    }

    return <ScrollView>
        <View style={{ marginTop: 10 }}>
            <Input
                placeholder={TEXT.content}
                multiline
                inputContainerStyle={styles.input}
                inputStyle={{ padding: 7 }}
                value={substance}
                onChangeText={setSubstance}
            />
        </View>

        {image != '' &&
        <View style={styles.imageContainer}>
            <Image 
                source={{uri: `data:image/jped;base64,${image}`}} 
                style={styles.image}/>
        </View>}

        {choices.map((item, idex) => {
            const navipage = book.story.find(val => val.page === +item.slice(4, 8))
            const naviNow = item.substr(0, 4) === CODE.NAVI && navipage == undefined
            const duelId = book.characters.find(val => val.id === item.slice(5, 8))
            const duelNow = item.substr(0, 4) === CODE.DUEL && duelId == undefined
            const cb = branch.filter(val => val.slice(0, 8) === item.slice(0, 8)) // currentbranch

            const haveError = (b) => {
                if (book.story.find(value => value.page === +b.slice(-4)) == undefined) return TEXT.page_not_exist
                return ''
            }

            return <TouchableOpacity
                key={item + idex}
                style={styles.choiceCardCon}
                onPress={() => delWarn(() => deleteChoice(item))}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.typeDis}>{typeFilter(item)}</Text>
                    <Text style={styles.ctitle}>{item.slice(9)}</Text>
                </View>

                {item.slice(0, 4) === CODE.NAVI &&
                    <View style={styles.rowCenter}>
                        <Text style={styles.b}>* {TEXT.go_to_page} {+item.slice(4, 8)}</Text>
                        {naviNow && <Text style={styles.er}>{TEXT.page_not_exist}</Text>}
                    </View>}

                {item.slice(0, 4) === CODE.DUEL &&
                    <View>
                        <View style={styles.rowCenter}>
                            <Text style={styles.b}>{TEXT.VS_ID}: [{item.slice(5,8)}]</Text>
                            {duelNow && <Text style={styles.er}>{TEXT.char_id_not_exist}</Text>}
                        </View>

                        <Text style={styles.b}>* {TEXT.if_win_go_to}: {+cb[0].slice(-4)} 
                            <Text style={styles.er}>{haveError(cb[0])}</Text>
                        </Text>

                        <Text style={styles.b}>* {TEXT.if_lose_go_to}: {+cb[1].slice(-4)} 
                            <Text style={styles.er}>{haveError(cb[1])}</Text>
                        </Text>
                    </View>}

                {item.slice(0, 4) === CODE.FTUN &&
                    <View>
                        {item.slice(4, 5) === '0' ?
                            <View>
                                <Text style={styles.b}>
                                    * {TEXT.dice_is_even} : {+cb[0].slice(-4)} 
                                    <Text style={styles.er}> {haveError(cb[0])}</Text>
                                </Text>

                                <Text style={styles.b}>
                                    * {TEXT.dice_is_odd} : {+cb[1].slice(-4)} 
                                    <Text style={styles.er}> {haveError(cb[1])}</Text>
                                </Text>
                            </View>
                            :
                            <View>
                                <Text style={styles.b}>
                                    * {TEXT.dice_1} : {+cb[0].slice(-4)} 
                                    <Text style={styles.er}> {haveError(cb[0])}</Text>
                                </Text>
                                
                                <Text style={styles.b}>
                                    * {TEXT.dice_2} : {+cb[1].slice(-4)} 
                                    <Text style={styles.er}> {haveError(cb[1])}</Text>
                                </Text>

                                <Text style={styles.b}>
                                    * {TEXT.dice_3} : {+cb[2].slice(-4)} 
                                    <Text style={styles.er}> {haveError(cb[2])}</Text>
                                </Text>
                            </View>}
                    </View>}

                {item.slice(0, 4) === CODE.ATRB &&
                    <View>
                        <Text style={styles.b}>
                            * {`${TEXT.if_attr} ${item.slice(4, 5) === '1' ? TEXT.attack : item.slice(4, 5) === '2' ? TEXT.defend : TEXT.agility} ${TEXT.over} `}
                            {+cb[0].slice(5, 8)} 
                            {` ${TEXT.will_go_to} ${+cb[0].slice(-4)}`}
                            <Text style={styles.er}> {haveError(cb[0])}</Text>
                        </Text>
                    </View>}
            </TouchableOpacity>
        })}


        <View>
            <Button
                title={TEXT.add_choice}
                type='clear'
                containerStyle={{ margin: 10, marginTop: 0 }}
                buttonStyle={{ height: 50 }}
                onPress={() => setShowChoice(true)}
            />

            <Button
                title={TEXT.add_image}
                type='clear'
                containerStyle={{ margin: 10, marginTop: 0 }}
                buttonStyle={{ height: 50 }}
                onPress={async () => {
                    const resultImage = await openImage(false)
                    if(resultImage != null) setImage(resultImage)
                }}
            />

            <Button
                title={TEXT.save}
                raised
                containerStyle={{ margin: 10, marginTop: 0 }}
                buttonStyle={{ height: 50 }}
                onPress={() => {
                    dispatch(ADD_PAGE(page != undefined, pageNumber, substance, choices, branch, image))
                    navigation.goBack()
                }}
            />
        </View>

        

        <Overlay isVisible={showChoice} onBackdropPress={onCancel}>
            <View style={{ margin: 10, width: SCREEN_WIDTH * 0.85 }}>
                <ScrollView >
                    <Input
                        placeholder={TEXT.choice_content}
                        inputContainerStyle={styles.input}
                        value={choiceTitle}
                        onChangeText={setChoiceTitle}
                    />

                    <Divider style={{ bottom: 10 }} />

                    <View style={styles.marginb}>
                        <View style={{ flexDirection: 'row' }}>
                            <CtCheckBox
                                title={TEXT.navigation}
                                checked={type === CODE.NAVI}
                                onPress={() => setType(CODE.NAVI)}
                            />
                            <CtCheckBox
                                title={TEXT.fortune}
                                checked={type === CODE.FTUN}
                                onPress={() => setType(CODE.FTUN)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <CtCheckBox
                                title={TEXT.battle}
                                checked={type === CODE.DUEL}
                                onPress={() => setType(CODE.DUEL)}
                            />
                            <CtCheckBox
                                title={TEXT.attribute}
                                checked={type === CODE.ATRB}
                                onPress={() => setType(CODE.ATRB)}
                            />
                        </View>
                    </View>

                    <View>
                        {type === CODE.NAVI &&
                            <View>
                                <Input
                                    placeholder={TEXT.to_page}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={4}
                                    value={navi}
                                    onChangeText={setNavi}
                                />
                            </View>}


                        {type === CODE.DUEL &&
                            <View>
                                <Input
                                    placeholder={TEXT.battle_with}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={3}
                                    value={battleWith}
                                    onChangeText={setBattleWith}
                                />

                                <Input
                                    placeholder={TEXT.if_win_go_to}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={4}
                                    value={battleWin}
                                    onChangeText={setBattleWin}
                                />
                                <Input
                                    placeholder={TEXT.if_lose_go_to}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={4}
                                    value={battleLose}
                                    onChangeText={setBattleLose}
                                />
                            </View>}

                        {type === CODE.FTUN &&
                            <View>
                                <View style={styles.marginb}>
                                    <CtCheckBox
                                        title={TEXT.two_route}
                                        checked={twoRoute}
                                        onPress={() => setTwoRoute(true)}
                                    />
                                    <CtCheckBox
                                        title={TEXT.three_route}
                                        checked={!twoRoute}
                                        onPress={() => setTwoRoute(false)}
                                    />
                                </View>

                                <View>
                                    <Input
                                        placeholder={TEXT.route_1}
                                        keyboardType='numeric'
                                        inputContainerStyle={styles.input}
                                        maxLength={4}
                                        value={route1}
                                        onChangeText={setRoute1}
                                    />
                                    <Input
                                        placeholder={TEXT.route_2}
                                        keyboardType='numeric'
                                        inputContainerStyle={styles.input}
                                        maxLength={4}
                                        value={route2}
                                        onChangeText={setRoute2}
                                    />
                                    {!twoRoute &&
                                        <Input
                                            placeholder={TEXT.route_3}
                                            keyboardType='numeric'
                                            inputContainerStyle={styles.input}
                                            maxLength={4}
                                            value={route3}
                                            onChangeText={setRoute3}
                                        />
                                    }
                                </View>
                            </View>}

                        {type === CODE.ATRB &&
                            <View>
                                <View style={styles.marginb}>
                                    <CtCheckBox
                                        title={TEXT.attack}
                                        checked={atrb === '1'}
                                        onPress={() => setAtrb('1')}
                                    />
                                    <CtCheckBox
                                        title={TEXT.defend}
                                        checked={atrb === '2'}
                                        onPress={() => setAtrb('2')}
                                    />
                                    <CtCheckBox
                                        title={TEXT.agility}
                                        checked={atrb === '3'}
                                        onPress={() => setAtrb('3')}
                                    />
                                </View>

                                <Input
                                    placeholder={TEXT.attribute_value}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={3}
                                    value={atrbValue}
                                    onChangeText={setAtrbValue}
                                />

                                <Input
                                    placeholder={TEXT.if_pass_go_to}
                                    keyboardType='numeric'
                                    inputContainerStyle={styles.input}
                                    maxLength={4}
                                    value={atrbPass}
                                    onChangeText={setAtrbPass}
                                />
                            </View>}
                    </View>

                    <View>
                        <Text style={styles.overlayError}>{errorOverlayText}</Text>
                    </View>

                    <View style={styles.overBtCon}>
                        <Button
                            title={TEXT.cancel}
                            buttonStyle={{ width: 100 }}
                            onPress={onCancel}
                        />
                        <Button
                            title={TEXT.ok}
                            buttonStyle={{ width: 100 }}
                            disabled={isEmpty()}
                            onPress={() => {
                                const h = choices.find(val => {
                                    const na = val.substr(0, 8) === `${type}${fixN(navi, 4)}`
                                    const du = val.substr(0, 8) === `${type}0${fixN(battleWith, 3)}`
                                    const at = val.substr(0, 8) === `${type}${atrb}${fixN(atrbValue, 3)}`
                                    const split = type === CODE.NAVI ? na : type === CODE.DUEL ? du : type === CODE.ATRB ? at : false
                                    return split
                                })
                                const same = pageNumber == +battleWin || pageNumber == +battleLose || 
                                    pageNumber == +navi || pageNumber == +atrbPass || 
                                    pageNumber == route1 || pageNumber == route2 || pageNumber == route3 
                                if (h != undefined && type !== 'FTUN') setErrorOverlayText(TEXT.already_exist)
                                else if(same) setErrorOverlayText(TEXT.dup_with_current_page)
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

const CtCheckBox = ({ title, checked, onPress }) => (
    <CheckBox
        title={title}
        checked={checked}
        onPress={onPress}
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
    />
)

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 0,
        backgroundColor: '#ebebeb',
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    marginb: {
        marginBottom: 10
    },
    er: {
        color: 'red'
    },
    imageContainer: {
        margin: 10
    },
    image: {
        width: SCREEN_WIDTH - 20, 
        height: SCREEN_WIDTH - 20, 
        borderRadius: 2,
        alignSelf: 'center', 
        resizeMode: 'contain'
    },
    choiceCardCon: {
        margin: 10, 
        padding: 5 ,
        borderWidth: 1, 
        borderColor: '#ababab',
        borderRadius: 5,
        width: SCREEN_WIDTH - 20, 
    },
    rowCenter: {
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    typeDis: {
        backgroundColor: 'darkcyan', 
        color: 'white',
        fontSize: 16,
        padding: 2,
        borderRadius: 5,
        marginRight: 5
    },
    ctitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1
    },
    b: {
        alignSelf: 'center',
        fontSize: 15
    },
    overlayError: {
        color: 'red',
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 5
    },
    overBtCon: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default PageScreen