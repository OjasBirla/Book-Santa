import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';

import db from '../config';
import firebase from 'firebase';

import { MyHeader } from '../Component/MyHeader';

import { BookSearch } from 'react-native-google-books';

import { FlatList } from 'react-native';

export default class BookRequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            bookName: "",
            description: "",
            isBookRequestActive: false,
            requestedBookName: "",
            bookStatus: "",
            docId: "",
            requestedDocId: "",
            userDocId: "",
            requestId: "",
            showFlatlist: false,
            dataSource: "",
        }
    }

    createUniqueID = () => {
        return Math.random().toString(36).substring(7);
    }

    addRequest = async (bookName, description) => {
        var userID = this.state.userID;
        var uniqueID = this.createUniqueID();
        var book = await BookSearch.searchbook(bookName, "AIzaSyByNT4KC-KbqmSxCgjUWce49Cfacc3bfCA");

        db.collection("requested_books").add({
            "user_Id": userID,
            "book_name": bookName,
            "reson_to_request": description,
            "request_Id": uniqueID,
            "book_status": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "image_link": book.data[0].volumeInfo.imageLinks.smallThumbnail,
        })

        await this.getBookRequest();

        db.collection("user").where("user_Id", "==", this.state.userID).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection("user").doc(doc.id).update({
                    isBookRequestActive: true
                })
            })
        })

        this.setState({bookName: "", description: "", requestId: uniqueID});
    }

    getBookRequest = () => {
        var bookRequest = db.collection("requested_books").where("user_Id", "==", this.state.userID).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().book_status !== "recived") {
                    this.setState({ requestId: doc.data().request_Id, 
                    requestedBookName: doc.data().book_name,
                    bookStatus: doc.data().book_status,
                    docId: doc.id })
                }
            })
        })
    }

    getIsBookRequestActive = () => {
        db.collection("user").where("user_Id", "==", this.state.userID)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({ isBookRequestActive: doc.data().isBookRequestActive, userDocId: doc.id });
            })
        })
    }

    updateBookRequestStatus = () => {
        db.collection("requested_books").doc(this.state.docId).update({
            book_status: "recived"
        })

        db.collection("user").where("user_Id", "==", this.state.userID).get()
        .snapshot((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection("user").doc(doc.id).update({
                    isBookRequestActive: false,
                })
            })
        })
    }

    sendNotification = () => {
        db.collection("user").where("username", "==", this.state.userID).get()
        .snapshot((snapshot) => {
                snapshot.forEach((doc) => {
                var name = doc.data().first_name;
                var lastName = doc.data().last_name;
        
        db.collection("all_notifications").where("request_id", "==", this.state.requestId).get()
            .snapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    var donerId = doc.data().doner_Id;
                    var bookName = doc.data().book_name;
                
        db.collection('all_notifications').add({ 
            "targeted_user_Id" : donerId, 
            "message" : name +" " + lastName + " received the book " + bookName,
            "notification_status" : "unread",
            "book_name" : bookName 
        })
            })
        })
            })
        })
    }

    async getBooksFromApi(bookName) {
        this.setState({bookName: bookName});

        if(bookName.lenght > 2) {
            var book = await BookSearch.searchbook(bookName, "AIzaSyByNT4KC-KbqmSxCgjUWce49Cfacc3bfCA");

            this.setState({showFlatlist: true, dataSource: book.data()})
        }
    }

    renderItem = ({ item, i }) => { 
        // let obj = { 
        //     title: item.volumeInfo.title, 
        //     selfLink: item.selfLink, 
        //     buyLink: item.saleInfo.buyLink, 
        //     imageLink: item.volumeInfo.imageLinks,
        // };
        return ( 
            <TouchableHighlight style={styles.touchableopacity} 
            activeOpacity={0.6} 
            underlayColor="#DDDDDD" 
            onPress={() => { 
                this.setState({ 
                    showFlatlist: false, 
                    bookName: item.volumeInfo.title, 
                }); 
            }} 
            bottomDivider > 
                <Text> {item.volumeInfo.title} </Text> 
            </TouchableHighlight> 
        );
    };

    render() {
        if(this.state.isBookRequestActive) {
            return (
                <View style={styles.container}>
                    <View style = {{flex:1,justifyContent:'center'}}>
                        <View style={{borderColor:"orange", borderWidth:2, justifyContent:'center', alignItems:'center', padding:10, margin:10}}>
                            <Text>Book Name</Text> 
                            <Text>{this.state.requestedBookName}</Text> 
                        </View>
                        <View style={{borderColor:"orange", borderWidth:2, justifyContent:'center', alignItems:'center', padding:10, margin:10}}> 
                            <Text> Book Status </Text>
                            <Text>{this.state.bookStatus}</Text> 
                        </View> 
                        <TouchableOpacity style={{borderWidth:1, borderColor:'orange', backgroundColor:"orange", width:300, alignSelf:'center', alignItems:'center', height:30, marginTop:30}} 
                        onPress={()=>{ 
                            this.sendNotification() 
                            this.updateBookRequestStatus(); 
                            this.receivedBooks(this.state.requestedBookName)
                        }}> 
                            <Text>I recieved the book </Text> 
                        </TouchableOpacity> 
                    </View>
                </View>
            )
        }

        else {
            return (
                <KeyboardAvoidingView style={styles.container}>
                    <View style={styles.container}>
                        <MyHeader title="Request Book" />

                        <TextInput style={styles.input}
                        placeholder="Name of the book"
                        onChangeText={(text) => {
                            this.setState({bookName: text})
                        }}
                        value = {this.state.bookName} />
                        
                        { this.state.showFlatlist ?
                            (<FlatList keyExtractor={({item, index}) => index.toString()} 
                            data={this.state.dataSource} 
                            renderItem={this.renderItem} 
                            style={{margin: 10}}
                            enableEmptySections={true} />) :
                            (null)
                        }
                        <TextInput style={styles.input}
                        placeholder="Reason for the Book"
                        multiline={true}
                        onChangeText={(text) => {
                            this.setState({description: text})
                        }}
                        value = {this.state.description} />

                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.addRequest(this.state.bookName, this.state.description);
                        }}>
                            <Text>Request</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )
        }
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