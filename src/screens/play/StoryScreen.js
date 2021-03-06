import React, { useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native'
import { Overlay, Button } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { UPDATE_PAGE } from '../../lib/redux/actions/playActions'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CODE, NAME_REGEX, SCREEN_WIDTH } from '../../utils/constant'
import { PLAY_TEXT } from '../../utils/string'
import { BOOKMARK } from '../../lib/redux/actions/shelfActions'

const StoryScreen = ({navigation, route}) => {
    const dispatch = useDispatch()
    const TEXT = PLAY_TEXT()
    const storyName = route.params?.name
    const story = useSelector(reducer => reducer.play.story)
    const page = useSelector(reducer => reducer.play.currentPage)
    const pageContent = useMemo(() => story.find(val => val.page === page), [ story, page ])

    const subChar = useSelector(reducer => reducer.play.characters)
    const mainChar = useSelector(reducer => reducer.char)
    const name = useMemo(() => mainChar != null ? mainChar.name : TEXT.anon, [mainChar])
    const [ escOverlay , setEscOverlay ] = useState(false)
    const [ dice, setDice ] = useState(0)
    const [ currentChoice, setCurrentChoice ] = useState(null)
    const [ escTo, setEscTo ] = useState(null)

    const [imageRatio, setImageRatio] = useState(1)
    
    const flatlistRef = useRef()


    useLayoutEffect(() => {
        navigation.setOptions({
            title: storyName,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Character')}>
                    <MaterialCommunityIcons name='account' size={29} style={{marginRight: 7}}/>
                </TouchableOpacity>
            )
        })
    }, [navigation])


    useEffect(() => {
        if(mainChar == null) navigation.navigate('Character')
    },[mainChar])


    useEffect(() => {
        dispatch(BOOKMARK(storyName, page))
        
        Image.getSize(`data:image/jpeg;base64,${pageContent.image}`, (w,h) => setImageRatio(w/h), (e)=>{})

        if(flatlistRef!=undefined) flatlistRef.current.scrollToOffset({ offset: 0})
    }, [page])


    const ftunTap = (item) => {
        const twoOrThree = item.slice(4,5) === '0' ? 2 : 3
        let successOrFail = CODE.FA

        const diceNumber = Math.floor(Math.random() * 6) + 1
        setDice(diceNumber)
        if(twoOrThree===2) successOrFail = diceNumber%2==0 ? CODE.SU : CODE.FA
        else successOrFail = diceNumber <= 2 ? CODE.FA : diceNumber == 3 || diceNumber == 4 ? CODE.DR : CODE.SU

        const code = pageContent.branch.find(val => val.slice(0,10) === item.slice(0,8) + successOrFail)
        const toPage = Number(code.slice(-4))

        setEscTo(toPage)
    }


    const listHeader = () => (
        <View>
            {pageContent.image != '' &&
            <View style={{alignItems: 'center', margin: 10}}>
                <Image 
                    source={{uri: `data:image/jpeg;base64,${pageContent.image}`}}
                    style={{width: SCREEN_WIDTH - 20, height: (SCREEN_WIDTH - 20) / imageRatio, borderRadius: 2}}
                />
            </View>
            }

            <Text style={styles.content}>{pageContent.content.replace(NAME_REGEX , name)}</Text>
        </View>
    )

    const renderItem = ({item}) => {
        let atrb, require
        let block = false
        if(item.slice(0,4) === CODE.ATRB) {
            atrb = item.slice(4,5) === '1' ? 'atk' : item.slice(4,5) === '2' ? 'def' : 'agi'
            require = Number(item.slice(5,8))
            block = mainChar[atrb] < require
        }
        return <Button
            title={item.slice(9).replace(NAME_REGEX, name)}
            disabled={block}
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyles}
            onPress={() => {
                if(mainChar != null){
                    switch(item.slice(0,4)){
                        case CODE.NAVI:
                            dispatch(UPDATE_PAGE( Number(item.slice(4,8)) ))
                            break
                        case CODE.FTUN:
                            setCurrentChoice(item)
                            setEscOverlay(true)
                            break
                        case CODE.ATRB:
                            const code = pageContent.branch.find(val => val.slice(0,8) === item.slice(0,8))
                            dispatch(UPDATE_PAGE( Number(code.slice(-4)) ))
                            break
                        case CODE.DUEL:
                            navigation.navigate('Battle',{ code : item.slice(0,8), pageContent: pageContent })
                            break
                    }
                } else {
                    Alert.alert(TEXT.no_character,null,null,{cancelable: true})
                }
            }}
        />
    }

    return <View style={{flex: 1}}> 
        {pageContent!=undefined ? pageContent.choices &&
            <FlatList
                data={pageContent.choices}
                keyExtractor={data => data}
                ListHeaderComponent={listHeader}
                contentContainerStyle={{paddingBottom: 10}}
                ref={flatlistRef}
                renderItem={renderItem}
            />
        :null}
        

        <Overlay isVisible={escOverlay}>
            <View>
                {dice!=0 &&
                <MaterialCommunityIcons style={{margin: 10}} name={`dice-${dice}`} size={85}/>}
            </View>
            <Button
                title={dice?TEXT.OK:TEXT.roll_dice}
                buttonStyle={styles.buttonStyles}
                onPress={() => {
                    if(!dice) ftunTap(currentChoice)
                    else {
                        dispatch(UPDATE_PAGE(escTo))
                        setDice(0)
                        setEscOverlay(false)
                    }
                }}
            />
        </Overlay>
    </View>
}

const styles = StyleSheet.create({
    content : {
        fontSize: 19,
        marginBottom: 20,
        margin: 10
    },
    buttonContainer: {
        marginBottom: 10, 
        marginHorizontal: 10
    },
    buttonStyles: {
        backgroundColor: 'darkcyan'
    }
})

export default StoryScreen