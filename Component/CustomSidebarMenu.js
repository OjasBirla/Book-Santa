import React from 'react';
import { View, Text , TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';

import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import db from '../config'
import firebase from 'firebase';
import { round } from 'react-native-reanimated';

export default class CustomSidebarMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            userId: firebase.auth().currentUser.email,
            image: null,
            docId: "",
            name: "",
        }
    }

    fetchImage = (imageName) => {
        var storageRef = firebase.storage().ref().child("user_profile/" + imageName);

        storageRef.getDownloadURL()
        .then((url) => { 
            this.setState({ image: url }); 
        }) 
        
        .catch((error) => { 
            this.setState({ image: "#" }); 
        });
    }

    updateProfilePicture = async (uri, imageName) => {
        var response = await fetch(uri);

        // It is a raw file that stores Image data in the Binary form
        var blob = await response.blob();

        var ref = firebase.storage().ref().child("user_profile/" + imageName);
        return ref.put(blob).then((response) => this.fetchImage(imageName))
    }

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, 
            allowsEditing: true, 
            aspect: [4, 3], 
            quality: 1,
        })

        if (!cancelled) this.updateProfilePicture(uri, this.state.userId);
    }

    getUserProfile = () => {
        db.collection("users").where("eamil_Id", "==", this.state.userId)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({name: doc.data().first_name + " " + doc.data().lastName})
            })
        })
    }

    componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }

    render() {
        return (
            <View>
                <View style={{flex: 1}}>
                    <View styles={{flex:0.5, borderColor:'red', borderWidth:2, alignItems:'center', backgroundColor:'orange'}}>
                        <Avatar rounded
                        source={{ uri: this.state.image }}
                        size="medium"
                        onPress={() => this.selectPicture()}
                        containerStyle={styles.imageContainer}
                        showEditButton />

                        <Text style={{fontWeight: 100, fontSize: 100, paddingTop: 10 }}>{this.state.name}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View>
                        <DrawerItems {...this.props} />
                        <TouchableOpacity style={styles.logOutButton}
                        onPress={() => {
                            this.props.navigation.navigate("LogIn");
                            firebase.auth().signOut();
                        }}>
                            <Text>SignOut</Text>
                        </TouchableOpacity>
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

    logOutButton: {
        width: 200,
        height: 50,
        padding: 10,
        margin: 10,
        backgroundColor: "lightgreen",
        borderWidth: 2,
        borderRadius: 100,
        textAlign: "center",
        textAlignVertical: "center",
    }
})