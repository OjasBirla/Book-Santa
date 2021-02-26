import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import db from '../config';
import firebase from 'firebase';

import { MyHeader } from '../Component/MyHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class SettingsScreen extends React.Component {
    constructor() {
        super(props);

        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            contact: "",
            address: "",
            docId: "",
        }
    }

    updateUserDetails = () => {
        db.collection("user").doc(this.state.docId).update({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "mobile_number": this.state.contact,
            "address": this.state.address,
        })
    }

    getUserDetails() {
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection("user").where("email_Id", "==", email).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var data = doc.data();
                this.setState({
                    username: data.email_Id,
                    firstName: first_name,
                    lastName: last_name,
                    address: mobile_number,
                    contact: mobile_number,
                    docId: doc.id,
                })
            })
        })
    }

    componentDidMount() {
        this.getUserDetails();
    }

    render() {
        return (
            <View style={styles.container}>
                <MyHeader title="Settings" /*navigation={this.props.navigation}*/ />
                <TextInput style={styles.Input}
                    placeholder={"First Name"}
                    maxLength={8}
                    onChangeText={(text) => {
                        this.setState({firstName: text});
                    }}
                    value={this.state.firstName} />
                
                <TextInput style={styles.Input}
                    placeholder={"Last Name"}
                    maxLength={8}
                    onChangeText={(text) => {
                        this.setState({lastName: text});
                    }}
                    value={this.state.lastName} />

                <TextInput style={styles.Input}
                    placeholder={"Email"}
                    keyboardType={"email-address"}
                    onChangeText={(text) => {
                        this.setState({lastName: text});
                    }} 
                    value={this.state.email} />

                <TextInput style={styles.Input}
                    placeholder={"Contact"}
                    keyboardType={"numeric"}
                    maxLength={10}
                    onChangeText={(text) => {
                        this.setState({lastName: text});
                    }}
                    value={this.state.contact} />

                <TextInput style={styles.Input}
                    placeholder={"Adderess"}
                    multiline={true}
                    onChangeText={(text) => {
                        this.setState({address: text});
                    }}
                    value={this.state.address} />

                <TouchableOpacity style={styles.button}
                onPress={() => {
                    this.updateUserDetails();
                }}>
                    <Text>Save</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
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

    Input: {
        width: 300,
        height: 50,
        borderRadius: 100,
        margin: 10,
        borderWidth: 2,
        padding: 10,
    },
})