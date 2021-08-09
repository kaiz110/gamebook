import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, View, Text } from 'react-native'
import { Divider, Button } from 'react-native-elements'
import { useSelector } from 'react-redux'

const DetailScreen = ({navigation,route}) => {
    const state = useSelector(reducer => reducer.create)
    const book = useMemo(() => state.books.find(val => val.name === state.currentBook) ,[ state ]) 

    return <View>
        <Text style={{alignSelf: 'center', fontSize: 24}}>{book.name}</Text>
        <View style={{borderWidth: 1, width: '100%', margin: 10, borderColor: '#dedede', padding: 10}}>
            <Text>{book.summary}</Text>
        </View>

        <Button
            title='Characters'
            onPress={() => navigation.navigate('CharCreate')}
        />

        <Divider/>

        <FlatList
            data={book.story}
            keyExtractor={data => String(data.page) + data.content}
            renderItem={({item}) => (
                <TouchableOpacity 
                    style={{borderWidth: 1, width: '100%', height: 50, margin: 10}}
                    onPress={() => navigation.navigate('Page', {page: item})}
                >
                    <Text style={{fontSize: 25}}>Page {item.page}</Text>
                </TouchableOpacity>
            )}
        />

        <TouchableOpacity 
            style={{alignItems: 'center', justifyContent: 'center', borderWidth: 2,borderRadius: 7, margin: 10, height: 150}} 
            onPress={() => navigation.navigate('Page')}
        >
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Add page</Text>
        </TouchableOpacity>

    </View>
}

const styles = StyleSheet.create({})

export default DetailScreen