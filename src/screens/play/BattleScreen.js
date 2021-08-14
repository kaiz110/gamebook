import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { StyleSheet, View, Text, SafeAreaView, BackHandler, Alert, FlatList, Animated } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { Slider, Divider, Button } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/constant'
import { UPDATE_PAGE } from '../../lib/redux/actions/playActions'
import { CHAR_LEVEL_UP } from '../../lib/redux/actions/charActions'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CODE } from '../../utils/constant'
import { PLAY_TEXT } from '../../utils/string'

const BattleScreen = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const TEXT = PLAY_TEXT()
    const code = route.params?.code
    const pageContent = route.params?.pageContent
    const finalCode = (winOrLose) => pageContent.branch.find(val => val.slice(0,10) === code + winOrLose)

    const characters = useSelector(reducer => reducer.play.characters)
    const player = useSelector(reducer => reducer.char)
    const enemy = useMemo(() => characters.find(val => val.id === code.slice(-3)), [characters,code])

    const [playerHp, setPlayerHp] = useState(player.hp)
    const [enemyHp, setEnemyHp] = useState(enemy.hp)

    const [state, setState] = useState('START') // start, battle
    const [whoseTurn, setWhoseTurn] = useState('draw') // draw,player,enemy
    const [flipCoin, setFlipCoin] = useState('no')// no , yes, done

    const [playerDice, setPlayerDice] = useState( (new Array( Math.max(1, Math.floor(player.agi / 5)) )).fill(0) )
    const [enemyDice, setEnemyDice] = useState( (new Array( Math.max(1, Math.floor(enemy.agi / 5)) )).fill(0) )
    const [rolled, setRolled] = useState(false)

    const diceNumber = whoseTurn === 'player' ? playerDice.reduce((a,c) => a + c) : enemyDice.reduce((a,c) => a + c)
    const playerDmg = Math.max(0, player.atk * diceNumber - (enemy.def * (Math.floor(enemy.def / 10) + 1) )) // dmg cal
    const enemyDmg = Math.max(0, enemy.atk * diceNumber - (player.def * (Math.floor(player.def / 10) + 1) ))

    const playerDmgOpacity = useRef(new Animated.Value(0)).current
    const enemyDmgOpacity = useRef(new Animated.Value(0)).current
    const playerDmgFont = useRef(new Animated.Value(0)).current
    const enemyDmgFont = useRef(new Animated.Value(0)).current

    const [finish, setFinish] = useState(false)

    useEffect(() => {
        if(state === 'START') {
            if(player.agi > enemy.agi) setWhoseTurn('player')
            else if(player.agi < enemy.agi) {
                setWhoseTurn('enemy')
            } else {
                setWhoseTurn('draw')
                setFlipCoin('yes')
            }
        }
        
        return navigation.addListener('beforeRemove', (e) => {
            if(finish) return

            e.preventDefault();
    
            Alert.alert(
              TEXT.surrender,
              TEXT.do_you_want_to_surrender,
              [
                { 
                    text: TEXT.no,  
                    style: 'cancel',
                    onPress: () => null 
                },
                {
                    text: TEXT.yes,
                    onPress: () => {
                        const branchLost = Number(finalCode(CODE.FA).slice(-4))
                        dispatch(UPDATE_PAGE(branchLost))
                        navigation.dispatch(e.data.action)
                    }
                }
              ]
            );
        })
    },[ navigation, finish ])

    const enemyGetDmg = () => {
        Animated.sequence([
            Animated.timing(playerDmgOpacity, {
                toValue: 1, 
                duration: 1,
                useNativeDriver: false
            }),
            Animated.timing(playerDmgOpacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false
            })
        ]).start()
    }

    const playerGetDmg = () => {
        Animated.sequence([
            Animated.timing(enemyDmgOpacity, {
                toValue: 1, 
                duration: 1,
                useNativeDriver: false
            }),
            Animated.timing(enemyDmgOpacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: false
            })
        ]).start()
    }

    useEffect(() => {
        playerDmgFont.setValue(playerDmg)
        enemyDmgFont.setValue(enemyDmg)

        if(playerDice[0] != 0 || enemyDice[0] != 0){
            if (whoseTurn === 'player') {
                enemyGetDmg()
                setEnemyHp(enemyHp - playerDmg)
            } else { 
                playerGetDmg()
                setPlayerHp(playerHp - enemyDmg)
            }
        }
    }, [ playerDice, enemyDice ])

    useEffect(() => {
        if(playerHp <= 0 || enemyHp <= 0) {
            if(enemyHp <= 0) { 
                dispatch(CHAR_LEVEL_UP( enemy.exp ))
                dispatch(UPDATE_PAGE( Number(finalCode(CODE.SU).slice(-4)) ))
            } else {
                dispatch(UPDATE_PAGE( Number(finalCode(CODE.FA).slice(-4)) ))
            }

            setFinish(true)
            Alert.alert(
                playerHp<=0?`${enemy.name} ${TEXT.won}`:`${player.name} ${TEXT.won}`,null,
                [{
                    text: TEXT.OK,
                    onPress: () => navigation.goBack()
                }],
                {cancelable: true})
        }
    }, [playerHp, enemyHp])

    const renderStart = () => (
        <View style={styles.startContainer}>
            { whoseTurn!=='draw'
            ?<Text style={styles.startText}>{whoseTurn=='player'? player.name: enemy.name} {TEXT.go_first} {flipCoin==='done'?'':TEXT.because_of_higher_agility}</Text>
            :<Text style={styles.startText}>{TEXT.flip_a_coin_to_know_who_go_first}</Text>
            }

            <Button
                title={flipCoin==='yes'?TEXT.flip_coin:TEXT.OK}
                type='outline'
                buttonStyle={styles.middleButton}
                onPress={() => {
                    if(flipCoin==='yes') {
                        const flip = Math.floor(Math.random() * 2)
                        if(flip) setWhoseTurn('player')
                        else setWhoseTurn('enemy')
                        setFlipCoin('done')
                    }else {
                        if(whoseTurn === 'enemy') {
                            setEnemyDice(enemyDice.map(val => Math.floor(Math.random() * 6) + 1))
                        }
                        setState('BATTLE')
                    }
                }}
            />
            
        </View>
    )

    const renderBattle = () => {
        const notEmptyRolled = (playerDice[0] != 0 || enemyDice[0] != 0) && (rolled || whoseTurn === 'enemy')
        

        return <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <Text style={{position: 'absolute' , top: 0, alignSelf: 'center', fontWeight: 'bold'}}>{whoseTurn==='player'?TEXT.your_turn:TEXT.opponent_turn}</Text>
            <View>
                {notEmptyRolled &&
                <View>
                    <FlatList
                        data={whoseTurn==='player'?playerDice:enemyDice}
                        horizontal
                        keyExtractor={() => String(Math.random())}
                        renderItem={({item}) => {
                            return <MaterialCommunityIcons name={`dice-${item}`} size={75}/>
                        }}
                    />

                    <Text style={{fontSize: 16}}>{TEXT.total_damage} {whoseTurn==='player'?player.name:enemy.name} {TEXT.dealt}</Text>
                    <Text style={{alignSelf: 'center', fontSize: 25,top: 10, fontWeight: 'bold'}}>
                        {whoseTurn === 'player' ? playerDmg : enemyDmg }
                    </Text>
                </View>
                }
            </View>

            <View>
                <Button
                title={!rolled && whoseTurn==='player'?TEXT.roll_dice:'OK'}
                disabled={finish}
                type='outline'
                buttonStyle={[styles.middleButton,{alignSelf: 'center'}]}
                onPress={() => {
                    if(!rolled && whoseTurn==='player') {
                        setPlayerDice(playerDice.map(val => Math.floor(Math.random() * 6) + 1))
                        setRolled(true)
                    } else {
                        setWhoseTurn(whoseTurn==='player'?'enemy':'player')
                        if(whoseTurn==='player') {
                            setEnemyDice(enemyDice.map(val => Math.floor(Math.random() * 6) + 1))
                            setRolled(false)
                        }
                    }
                }}
                />
            </View>
            
        </View>
    }

    const enemyDmgStyle = () => {
        const fontSize = enemyDmgFont.interpolate({
            inputRange: [0,175],
            outputRange: [20,50],
            extrapolateRight: 'clamp'
        })

        return [{fontSize, fontWeight: 'bold', color: 'red'}]
    }

    const playerDmgStyle = () => {
        const fontSize = playerDmgFont.interpolate({
            inputRange: [0,175],
            outputRange: [20,50],
            extrapolateRight: 'clamp'
        })

        return [{fontSize, fontWeight: 'bold', color: 'red'}]
    }


    return <SafeAreaView style={{ justifyContent: 'space-between', flex: 1 }}>
        <View>
            <CustomSlider
                value={enemyHp}
                min={0}
                max={enemy.hp}
            />
            <Text style={styles.name}>{enemy.name} - {TEXT.level} {enemy.lvl}</Text>
            <Divider style={styles.divider} />
        </View>

        <View style={styles.middle}>
            {
                state == 'START'
                ? renderStart()
                : state == 'BATTLE'
                ? renderBattle()
                : null
            }
        </View>

        <View>
            <Divider style={styles.divider} />
            <Text style={styles.name}>{player.name} - {TEXT.level} {player.lvl}</Text>
            <CustomSlider
                value={playerHp}
                min={0}
                max={player.hp}
            />
        </View>

        {whoseTurn!=='enemy' && rolled &&
        <Animated.View style={[styles.dmgDisplay,{top: 5},{opacity: playerDmgOpacity}]}>
            <Animated.Text style={playerDmgStyle()}>-{playerDmg}</Animated.Text>
        </Animated.View>
        }

        {whoseTurn!=='player' && 
        <Animated.View style={[styles.dmgDisplay,{bottom: 5},{opacity: enemyDmgOpacity}]}>
            <Animated.Text style={enemyDmgStyle()}>-{enemyDmg}</Animated.Text>
        </Animated.View>
        }
    </SafeAreaView>
}

const CustomSlider = ({ value, max, min }) => {
    const prc = Math.floor(value / max * 100)
    return <Slider
        trackStyle={{ height: 10 }}
        style={{ marginHorizontal: 5 }}
        minimumTrackTintColor={prc > 35 ? 'green' : prc > 15 ? 'yellow' : 'red'}
        thumbStyle={{ height: 0, width: 0 }}
        disabled
        minimumValue={min}
        maximumValue={max}
        value={value}
    />
}

const styles = StyleSheet.create({
    name: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        margin: 5
    },
    middle: {
        width: SCREEN_WIDTH - 10, 
        marginHorizontal: 5, 
        borderRadius: 7,
        height: SCREEN_HEIGHT * 0.45, 
        backgroundColor: '#dedede'
    },
    dmgDisplay: {
        position: 'absolute',
        alignSelf: 'center',
    },
    // middle
    startContainer: {
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center'
    },
    startText: {
        fontSize: 16, 
        fontWeight: 'bold'
    },
    middleButton: {
        borderWidth: 2, 
        padding: 10, 
        paddingHorizontal: 25
    }
})

export default BattleScreen