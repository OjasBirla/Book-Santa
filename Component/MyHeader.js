import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import db from '../config';
import firebase from 'firebase';

import { Header, Icon, Badge } from 'react-native-elements';

export default class MyHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
        }
    }

    getNumberOfUnReadNotification() {
        db.collection("all_notifications").where("notification_status", "==", "unread")
        .onSnapshot((snapshot) => {
            var unReadNotification = snapshot.docs.map((doc) => {
                doc.data();
            })

            this.setState({value: unReadNotification.length});
        })
    }

    componentDidMount() {
        this.getNumberOfUnReadNotification();
    }

    BellIconWithBadge = () => {
        return (
            <View>
                <Icon name="bell" type="font-awsome" color="#696969" size={25}
                onPress={() => props.navigation.navigate("Notification")} />
    
                <Badge value={this.state.value} containerStyle={{position: "absolute", top: -4, right: -4}} />
            </View>
        )
    }

    render() {
        return (
            <Header 
            leftComponent = {<Icon name="bars" type="font-awsome" color="#696969" onPress = {() => props.navigation.toggleDrawer()} /> }
            centerComponent = {{text: props.title, style: {color: "#60A5A9", fontSize: 20, fontWeight: 'bold'}}}
            rightComponent = {<BellIconWithBadge {...props} />}
            backgroundColor="lightgreen" 
            />
        )
    }
}