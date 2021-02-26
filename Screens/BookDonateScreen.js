import React from 'react';
import { View, Image, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

import db from '../config';
import firebase from 'firebase';

import { MyHeader } from '../Component/MyHeader';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default class BookDonateScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            requestedBookList: [],
        }

        this.requestRef = null;
    }

    componentDidMount() {
        this.getRequestedBookList();
    }

    getRequestedBookList = () => {
        this.requestRef = db.collection("requested_books")
        .onSnapshot((sanpshot) => {
            var requestedBookList = sanpshot.docs.map(document => document.data())

            this.setState({requestedBookList: requestedBookList});
        })
    }

    keyExtractor = (item, index) => index.toString();
    renderItem = ({item, i}) => {
        return (
            <ListItem key={i}
            title = {item.book_name}
            subtitle = {item.reason_to_request}
            titleStyle = {{color: "black", fontWeight: "bold"}}
            rightElement = {
            <TouchableOpacity style={styles.button}
            onPress={() => {
                this.props.navigation.navigate("reciverDetails", {"details": item})
            }} >
                <Text>View</Text>
            </TouchableOpacity>}
            leftElement = {
                <Image style={{height: 50, width: 50}} source={{uri: item.image_link}} />
            }
            bottomDivider />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <MyHeader title="Donate Book" /> */}
                <View style={styles.container}>
                    {this.state.requestedBookList.length === 0
                    ?   (<View>
                            <Text stye={{fontWeight: 20}}>List Of All Requested Books</Text>
                        </View>)
                        : (<FlatList keyExtractor={this.keyExtractor}
                        data={this.state.requestedBookList}
                        renderItem={this.renderItem} />)}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    input: {
        width: 300,
        height: 50,
        borderRadius: 100,
        margin: 10,
        borderWidth: 2,
        padding: 10,
    },

    button: {
        width: 200,
        height: 50,
        padding: 10,
        margin: 10,
        backgroundColor: "lightgreen",
        borderWidth: 2,
        borderRadius: 100,
        textAlign: "center",
        textAlignVertical: "center",
    },
})