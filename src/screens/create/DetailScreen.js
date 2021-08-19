import React, { useEffect,useState ,  useLayoutEffect } from 'react'
import { FlatList } from 'react-native'
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import { Divider, Button, Overlay } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { DEL_PAGE } from '../../lib/redux/actions/createActions'
import { PUT_ON } from '../../lib/redux/actions/shelfActions'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { ADD_ERROR, REMOVE_ERROR } from '../../lib/redux/actions/createActions'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImageManipulator from 'expo-image-manipulator';
import delWarn from '../../components/delWarn'
import { CODE, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/constant'
import { CREATE_TEXT } from '../../utils/string'

const DetailScreen = ({navigation,route}) => {
    const dispatch = useDispatch()
    const TEXT = CREATE_TEXT()
    const state = useSelector(reducer => reducer.create)
    const book = state.books.find(val => val.name === state.currentBook)
    const [showUpload, setShowUpload] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: book.name,
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => setShowUpload(true)}
                >
                    <Feather name='upload' size={25} style={{margin: 7}}/>
                </TouchableOpacity>
            )
        })
    }, [ navigation ])

    useEffect(() => {
        for(const pageContent of book.story.values()){
            let isError = false
            for(const value of pageContent.choices.values()) {
                const navipage = book.story.find(val => val.page === +value.slice(4,8))
                const navitest = navipage == undefined && value.slice(0,4) === CODE.NAVI
                const duelId = book.characters.find(val => val.id === value.slice(5,8))
                const dueltest = duelId == undefined && value.slice(0,4) === CODE.DUEL
                const choiceBranch = pageContent.branch.filter(val => val.slice(0,8) === value.slice(0,8))

                const branchpage = choiceBranch.some(val => {
                    const findPage = book.story.find(bs => bs.page === +val.slice(-4))
                    return findPage == undefined
                })
                if(navitest || dueltest || branchpage == true) isError = true
            }
            if(isError) dispatch(ADD_ERROR(pageContent.page))
            else dispatch(REMOVE_ERROR(pageContent.page))
        }
    }, [ book.story ])

    const test = async () => {
        const result = await AsyncStorage.getItem('@test')
        console.log('result', result.slice(-50))
        setPreviewImage(result)
    }

    const openImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(permissionResult.granted == true) {
            let pickResult = await ImagePicker.launchImageLibraryAsync({base64: true})
            const resizePick = await ImageManipulator.manipulateAsync(
                `data:image/jpg;base64,${pickResult.base64}`,
                [{resize: {width: 360, height: 270}}],
                { compress: 0.75, format: 'jpeg', base64: true}
            )
            console.log('BASE64', resizePick.base64.length)
            setPreviewImage(resizePick.base64)
            await AsyncStorage.setItem('@test', resizePick.base64)
        }
    }

    const listHeader = () => (
        <View>
            {previewImage != null &&
            <Image source={{uri: `data:image/jpeg;base64,${previewImage}`}} style={{width: 290, height: 175, alignSelf: 'center'}}/>
            }
            <View style={styles.bookSum}>
                <Text>{book.summary}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View>
                    <TouchableOpacity 
                        style={styles.imageCharBt}
                    >
                        <MaterialCommunityIcons name='image-area' size={37}/>
                        <Text>{TEXT.background_image}</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CharCreate')}
                        style={styles.imageCharBt}
                    >
                        <MaterialCommunityIcons name='account-multiple' size={37}/>
                        <Text>{TEXT.characters}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <Divider style={{margin: 10}}/>
        </View>
    )

    const listFooter = () => (
        <View>
            <TouchableOpacity 
                style={styles.footer} 
                onPress={() => navigation.navigate('Page')}
            >
                <Text style={{fontSize: 22}}>{TEXT.add_page}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderPageList = ({item}) => (
        <TouchableOpacity 
            style={styles.pageCardContainer}
            onPress={() => navigation.navigate('Page', {page: item})}
        >
            <View style={styles.cardHeadCon}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 22}}>{TEXT.page} {item.page}</Text>
                    <Text>{item.content.replace(/ +/g, "").split('').length} {TEXT.char}</Text>
                </View>

                {book.error.includes(item.page) &&
                <Text style={styles.errorText}>{TEXT.ERROR}</Text>}

                <TouchableOpacity 
                    onPress={() => delWarn(() => {
                        dispatch(DEL_PAGE(item))
                        dispatch(REMOVE_ERROR(item.page))
                    })}
                    style={styles.deleteBt}
                >
                    <Text style={{color: 'white'}}>{TEXT.DELETE}</Text>
                </TouchableOpacity>
            </View>

            <Text numberOfLines={5} style={styles.content}>{item.content}</Text>

            {item.choices.length > 0 &&
            <View style={styles.choices}>
                {item.choices.map((val,i) => (
                    <Text style={{color: 'darkcyan'}} key={val + i}>- {val.slice(9)}</Text>
                ))}
            </View>
            }
            
        </TouchableOpacity>
    )

    return <View style={{flex: 1}}>
        <FlatList
            data={book.story}
            keyExtractor={data => String(data.page) + data.content}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            renderItem={renderPageList}
        />

        <Overlay isVisible={showUpload} onBackdropPress={() => setShowUpload(false)}>
            <View style={styles.overlayCon}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>{TEXT.upload}</Text>
                <Text style={{fontSize: 18}}>{TEXT.are_you_finished}</Text>

                {book.error.length > 0 &&
                <Text style={{color: 'red'}}>{TEXT.cant_upload_because_of_error}</Text>}

                <View style={styles.overlayBt}>
                    <Button 
                        title={TEXT.yes}
                        type='clear'
                        disabled={book.error.length > 0}
                        onPress={() => {
                            if(book.error.length == 0) {
                                dispatch(PUT_ON(book))
                                setShowUpload(false)
                            }
                        }}
                    />

                    <Button
                        title={TEXT.no}
                        type='clear'
                        onPress={() => setShowUpload(false)}
                    />
                </View>
                
            </View>
        </Overlay>

    </View>
}

const styles = StyleSheet.create({
    imageCharBt: {
        padding: 10, 
        width: SCREEN_WIDTH/2-15,
        marginLeft: 10,
        height: SCREEN_HEIGHT*0.1,
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 1, 
        borderRadius: 5,
        borderColor: '#ababab',
        backgroundColor: 'honeydew'
    },
    bookSum: {
        borderWidth: 1, 
        width: SCREEN_WIDTH-20, 
        margin: 10, 
        borderColor: '#dedede', 
        padding: 10
    },
    pageCardContainer: {
        borderWidth: 2, 
        marginTop: 0,
        margin: 10, 
        borderRadius: 7
    },
    cardHeadCon: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginHorizontal: 10
    },
    errorText: {
        color: 'red', 
        fontWeight: 'bold'
    },
    deleteBt: {
        backgroundColor: 'indianred', 
        borderRadius: 5,
        padding: 2
    },
    content: {
        fontSize: 17, 
        margin: 10
    },
    choices: {
        alignItems: 'center', 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#dedede', 
        margin: 10, 
        padding: 5,
    },
    footer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        borderWidth: 2,
        borderColor: '#d3d3d3',
        borderRadius: 7, 
        margin: 10, 
        height: 150, 
        backgroundColor: 'honeydew'
    },
    overlayCon: {
        padding: 10, 
        alignItems: 'center', 
        width: '75%'
    },
    overlayBt: {
        flexDirection: 'row', 
        width: '100%', 
        justifyContent: 'space-evenly', 
        marginTop: 10
    }
})

export default DetailScreen