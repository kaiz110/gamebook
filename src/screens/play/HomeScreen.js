import React, { useState } from 'react'
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { LOAD } from '../../lib/redux/actions/playActions'
import { SCREEN_WIDTH } from '../../utils/constant'
import { AntDesign } from '@expo/vector-icons'
import { DUMP } from '../../lib/redux/actions/shelfActions'
import delWarn from '../../components/delWarn'

const HomeScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const bookShelf = useSelector(reducer => reducer.shelf)
    const [expand, setExpand] = useState('')

    const renderItem = ({item}) => (
        <View>
            <TouchableOpacity 
                style={styles.cardImageContain}
                onPress={() => {
                    dispatch(LOAD(item))
                    navigation.navigate('Story', {name: item.name})
                }}
                onLongPress={() => delWarn( () => dispatch(DUMP(item.name)) )}
            >
                <Image blurRadius={0.5} style={{flex: 1, borderRadius: 5}} source={{uri: `http://hd.wallpaperswide.com/thumbs/we_love_trees-t2.jpg`}}/>
                
                <View style={styles.textWrap}>
                    <Text style={styles.text}>{item.name}</Text>
                </View>
            </TouchableOpacity>

            {item.summary!='' &&
            <View>
                <TouchableOpacity onPress={() => {
                    if(expand === item.name) setExpand('')
                    else setExpand(item.name)
                }}>
                    <View style={styles.sumExpand}>
                        <AntDesign name={expand===item.name?'up':'down'} size={18} style={{opacity: 0.25}}/>
                        <Text style={{marginHorizontal: 25}}>SUMMARY</Text>
                        <AntDesign name={expand===item.name?'up':'down'} size={18} style={{opacity: 0.25}}/>
                    </View>
                </TouchableOpacity>

                {expand === item.name &&
                <View style={{width: SCREEN_WIDTH - 20, margin: 10, backgroundColor: '#dedede', padding: 10}}>
                    <Text>{item.summary}</Text>
                </View>
                }
            </View>
            }
        </View>
    )

    return <View style={styles.container}>
        <FlatList
            data={bookShelf}
            keyExtractor={(data,i) => data.name + i}
            renderItem={renderItem}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardImageContain: {
        margin: 10,
        width: SCREEN_WIDTH - 20, 
        height: SCREEN_WIDTH/2.5, 
        backgroundColor: '#dedede'
    },
    textWrap: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0, 
        right: 0,
        backgroundColor: '#3d3d3d', 
        opacity: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    text: {
        fontSize: 27, 
        color: 'white', 
        fontWeight: 'bold'
    },
    sumExpand: {
        flexDirection: 'row',
        width: SCREEN_WIDTH-40,
        padding: 10, 
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        borderRadius: 15,
        backgroundColor: 'indianred'
    }
})

export default HomeScreen