import React, { useEffect,useState ,  useLayoutEffect } from 'react'
import { FlatList } from 'react-native'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Divider, Button, Overlay } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { DEL_PAGE } from '../../lib/redux/actions/createActions'
import { PUT_ON } from '../../lib/redux/actions/shelfActions'
import { Feather } from '@expo/vector-icons'
import { ADD_ERROR, REMOVE_ERROR } from '../../lib/redux/actions/createActions'

const DetailScreen = ({navigation,route}) => {
    const dispatch = useDispatch()
    const state = useSelector(reducer => reducer.create)
    const book = state.books.find(val => val.name === state.currentBook)
    const [showUpload, setShowUpload] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
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
                const navitest = navipage == undefined && value.slice(0,4) === 'NAVI'
                const duelId = book.characters.find(val => val.id === value.slice(5,8))
                const dueltest = duelId == undefined && value.slice(0,4) === 'DUEL'
                const choiceBranch = pageContent.branch.filter(val => val.slice(0,8) === value.slice(0,8))

                const branchpage = choiceBranch.some(val => {
                    const findPage = book.story.find(bs => bs.page === +val.slice(-4))
                    return findPage == undefined
                })
                if(navitest || dueltest || branchpage == true) {
                    dispatch(ADD_ERROR(pageContent.page))
                    isError = true
                }
                else if(!isError) dispatch(REMOVE_ERROR(pageContent.page))
            }
        }
    }, [ book.story ])

    const listHeader = () => (
        <View>
            <Text style={{alignSelf: 'center', fontSize: 24}}>{book.name}</Text>
            <View style={{borderWidth: 1, width: '100%', margin: 10, borderColor: '#dedede', padding: 10}}>
                <Text>{book.summary}</Text>
            </View>

            <Button
                title='Characters'
                onPress={() => navigation.navigate('CharCreate')}
            />

            <Divider/>
        </View>
    )

    const listFooter = () => (
        <View>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center', borderWidth: 2,borderRadius: 7, margin: 10, height: 150}} 
                onPress={() => navigation.navigate('Page')}
            >
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>Add page</Text>
            </TouchableOpacity>
        </View>
    )

    return <View>
        <FlatList
            data={book.story}
            keyExtractor={data => String(data.page) + data.content}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            renderItem={({item}) => (
                <TouchableOpacity 
                    style={{borderWidth: 1, width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                    onPress={() => navigation.navigate('Page', {page: item})}
                >
                    <Text style={{fontSize: 25}}>Page {item.page}</Text>
                    {book.error.includes(item.page) &&
                    <Text>Error here!!!</Text>}

                    <TouchableOpacity onPress={() => Alert.alert('delete?',null, [
                        {text: 'Ok', onPress: () => dispatch(DEL_PAGE(item))}
                    ],{cancelable: true})}>
                        <Text>DELETE</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
        />

        <Overlay isVisible={showUpload} onBackdropPress={() => setShowUpload(false)}>
            <View>
                <Text>Upload</Text>
                <Text>you finished ?</Text>

                <Button 
                    title='Yes'
                    onPress={() => {
                        dispatch(PUT_ON(book))
                        setShowUpload(false)
                    }}
                />

                <Button
                    title='No'
                    onPress={() => setShowUpload(false)}
                />
            </View>
        </Overlay>

    </View>
}

const styles = StyleSheet.create({})

export default DetailScreen