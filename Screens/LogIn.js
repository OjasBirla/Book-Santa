import React from 'react';
import { View, Modal, ScrollView, Text, TouchableOpacity, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Image } from 'react-native';

import firebase from 'firebase';
import db from "../config";

export default class LogIn extends React.Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: "",
            isModalVisible: false,
            firstName: "",
            lastName: "",
            contact: "",
            address: "",
            confirmPassword: "",
        }
    }

    logIn = (emailID, password) => {
        firebase.auth().signInWithEmailAndPassword(emailID, password)
        .then (() => {
            console.log('auth')
            this.props.navigation.navigate("BookDonateScreen");
        })

        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            return Alert.alert(errorMessage);
        })
    }

    userSignUp = (emailID, password, confirmPassword) => {
        if (!confirmPassword){
            confirmPassword = password
        }
        if(password != confirmPassword) {
            return Alert.alert("Passwards Do Not Match \n Check Your Password");
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(emailID, password)
            .then ((response) => {
                return Alert.alert("User Added Successfuly");
            })

            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                return Alert.alert(errorMessage);
            })

            db.collection("user").add({
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                mobile_number: this.state.contact,
                email_Id: this.state.email,
                address: this.state.address,
                isBookRequestActive: false
            })
        }
    }
    showModal = () => {
        return(
            <Modal animationType="fade"
            transparent={true}
            visible={this.state.isModalVisible}>
                <View style={styles.ModalContainer}>
                    <ScrollView style={{width: "100%"}}>
                        <KeyboardAvoidingView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <Text>Register</Text>
                            <TextInput style={styles.Input}
                            placeholder={"First Name"}
                            maxLength={8}
                            onChangeText={(text) => {
                                this.setState({firstName: text});
                            }} />

                            <TextInput style={styles.Input}
                            placeholder={"Last Name"}
                            maxLength={8}
                            onChangeText={(text) => {
                                this.setState({lastName: text});
                            }} />
                            
                            <TextInput style={styles.Input}
                            placeholder={"Contact"}
                            maxLength={10}
                            keyboardType={"numeric"}
                            onChangeText={(text) => {
                                this.setState({contact: text});
                            }} />

                            <TextInput style={styles.Input}
                            placeholder={"Adderess"}
                            multiline={true}
                            onChangeText={(text) => {
                                this.setState({address: text});
                            }} />
                            
                            <TextInput style={styles.Input}
                            placeholder={"Email Adderess"}
                            keyboardType={"email-address"}
                            onChangeText={(text) => {
                                this.setState({email: text});
                            }} />

                            <TextInput style={styles.Input}
                            placeholder={"Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({password: text});
                            }} />

                            <TextInput style={styles.Input}
                            placeholder={"Confirm Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({password: text});
                            }} />

                            <View style={styles.ModalBackButton}>
                                <TouchableOpacity style={styles.registerButton}
                                onPress={()=>this.userSignUp(this.state.email, this.state.password, this.state.confirmPassword)}>
                                    <Text>Register</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.ModalBackButton}>
                                <TouchableOpacity style={styles.cancelButton}
                                onPress={()=>this.setState({"isModalVisible": false})}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.Container}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    {this.showModal()}
                </View>

                <Image soucre={require("../assets/Santa Image.jpg")} style={{width: 40, height: 40}} />

                <TextInput style={styles.Input}
                placeholder="Username"
                keyboardType="email_address"
                onChangeText={(text) => {
                    this.setState({email: text});
                }} />

                <TextInput style={styles.Input}
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(text) => {
                    this.setState({password: text})
                }} />

                <TouchableOpacity style={styles.Button}
                onPress={() => {this.logIn(this.state.email, this.state.password)}}>
                    <Text>LogIn</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Button}
                onPress={() => {
                    this.userSignUp(this.state.email, this.state.password)
                }}>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        alignItems: "center",
        justifyContent: "center",
    },

    Input: {
        width: 300,
        height: 50,
        borderRadius: 100,
        margin: 10,
        borderWidth: 2,
        padding: 10,
    },

    Button: {
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

    
    registerButton: {
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

    cancelButton: {
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