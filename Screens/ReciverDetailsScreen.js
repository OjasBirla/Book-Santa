import React from "react";
import { View, StyleSheet } from "react-native";

import { Header, Card, Icon } from 'react-native-elements';

import db from '../config';
import firebase from "firebase";

export default class ReciverDetailsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: firebase.auth().currentUser.email,
            username: "",
            reciverID: props.navigation.getParams("details") ["user_Id"],
            requestID: props.navigation.getParams("details") ["request_Id"],
            bookName: props.navigation.getParams("details") ["book_name"],
            resonToRequest: props.navigation.getParams("details") ["reson_to_request"],
            reciverName: "",
            reciverContact: "",
            reciverAddress: "",
            reciverRequestDocID: "",
        }
    }

    getReciverDetails() {
        db.collection("users").where("email_Id", "==", this.state.reciverID).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({reciverName: doc.data().first_name, reciverContact: doc.data().mobile_number, reciverAddress: doc.data().address})
            })
        })

        db.collection("requested_books").where("request_Id", "==", this.state.reciverID).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({reciverRequestDocID: doc.id})
            })
        })
    }

    updateBookStatus = () => {
        db.collection('all_donations').add({
            book_name : this.state.bookName, 
            request_id : this.state.requestId,
            requested_by : this.state.recieverName, 
            donor_id : this.state.userId, 
            request_status : "Donor Interested" 
        }) 
    }

    addNotification = () => {
        var message = this.state.username + " Has show interest to danate the book " + this.state.bookName;
        
        db.collection("all_notifications").add({
            targered_user_Id: this.state.reciverID,
            doner_Id: this.state.reciverID,
            request_Id: this.state.requestID,
            book_name: this.state.bookName,
            notification_status: "Unread",
            message: message,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.1}}>
                    <Header leftComponent={<Icon name="arrow-left" type="feather" color="gray" onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={{ text:"Donate Books", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
                    backgroundColor = "#eaf8fe" />
                </View>
                <View style={{flex: 0.3}}>
                    <Card title={"Book Information"} titleStyle= {{fontSize : 20}}>
                        <Card >
                            <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={{flex:0.3}}>
                    <Card
                        title={"Reciever Information"}
                        titleStyle= {{fontSize : 20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                
                <View style={styles.buttonContainer}>
                    {
                        this.state.recieverId !== this.state.userId
                        ?(
                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                                this.updateBookStatus();
                                this.addNotification();
                                this.props.navigation.navigate('MyDonations');
                            }}>
                            <Text>I want to Donate</Text>
                        </TouchableOpacity>
                        )
                        : null
                    }
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