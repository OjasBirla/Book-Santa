import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { Listitem, Icon } from 'react-native-elements';

import db from '../config';
import firebase from 'firebase';

import { MyHeader } from '../Component/MyHeader';

export default class MyDonationsScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            userID: firebase.auth().currentUser.email,
            allDonations: [],
            donerName: "",
        }

        this.requestRef = null;
    }

    getAllDonations = () => {
        this.requestRef = db.collections("all_donations").where("doner_Id", "==", this.state.userID)
        .onSnapshot((snapshot) => {
            var allDonations = snapshot.docs.map(document => document.data());
            this.setState({allDonations: allDonations});
        })
    }

    sendNotification = (bookDetails, requestStatus) => { 
        var requestId = bookDetails.request_id;
        var donorId = bookDetails.donor_id;
        db.collection("all_notifications").where("request_Id","==", requestId).where("donor_Id", "==", donorId).get()
        .then((snapshot) => { 
            snapshot.forEach((doc) => { 
                var message = ""
                if(requestStatus === "Book Sent") {
                    message = this.state.donorName + " sent you book" 
                }
                else { 
                    message = this.state.donorName + " has shown interest in donating the book" 
                } 
                
                db.collection("all_notifications").doc(doc.id).update({
                    "message": message,
                    "notification_status" : "unread",
                    "date" : firebase.firestore.FieldValue.serverTimestamp() 
                }) 
            }); 
        }) 
    }

    sendBook = (bookDetails) => {
        if(bookDetails.request_status === "Book Sent") {
            var requestStatus = "Doner Interested"

            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: "Doner Interested",
            })

            this.sendNotification(bookDetails, requestStatus);
        }

        else {
            var requestStatus = "Book Sent"

            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: "Book Sent"
            })

            this.sendNotification(bookDetails, requestStatus);
        }
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ( {item, i} ) => ( 
        <ListItem key={i}
        title={item.book_name}
        subtitle = {"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
        leftElement = {<Icon name="book" type="font-awesome" color ='#696969'/>}
        titleStyle = {{ color: 'black', fontWeight: 'bold' }}
        rightElement = { <TouchableOpacity style={styles.button}
        onPress={() => {
            this.sendBook();
        }}>
            <Text>Send Book</Text>
        </TouchableOpacity> }
        bottomDivider />
    )

    render() {
        return (
            <View style={styles.container} >
                <View style = {{flex: 0.1}}>
                    <MyHeader navigation={this.props.navigation} 
                    title="My Donations" /> 
                    <View style={{flex:1}}>
                        { this.state.allDonations.length === 0 ? 
                        (<View style={styles.subtitle}>
                            <Text style={{ fontSize: 20}}>
                                List of all book Donations
                            </Text>
                        </View> ) :
                        (<FlatList keyExtractor={this.keyExtractor}
                        data={this.state.allDonations}
                        renderItem={this.renderItem} /> ) }
                    </View>
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