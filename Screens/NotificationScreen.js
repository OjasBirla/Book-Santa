import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

import db from "../config";
import firebase from 'firebase';

export default class NotificationScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            userID: firebase.auth().currentUser.email,
            allNotification: [],
        }

        this.notificationRef = null;
    }

    getNotification = () => {
        this.notificationRef = db.collection("all_notification").where("notification_status", "==", "unread").where("targeted_user_id", "==", this.state.userID)
        .onSnapshot((snapshot) => {
            var allNotification = [];
            snapshot.docs.map((doc) => {
                var notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotification.push(notification);
            })

            this.setState({allNotification: allNotification});
        })
    }

    componentDidMount() {
        this.getNotification();
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ( {item, index} ) => ( 
        <ListItem key={index}
        title={item.book_name}
        subtitle = {item.message}
        leftElement = {<Icon name = "book" type = "font-awesome" color ='#696969'/>}
        titleStyle = {{ color: 'black', fontWeight: 'bold' }}
        bottomDivider />
    )

    render() {
        return (
            <View style={styles.container}>
                <View style = {{flex: 0.1}}>
                    <MyHeader navigation={this.props.navigation} 
                    title="Notifications" /> 
                    <View style={{flex:1}}>
                        { this.state.allNotification.length === 0 ? 
                        (<View style={styles.subtitle}>
                            <Text style={{ fontSize: 20}}>
                                You have No Notifications
                            </Text>
                        </View> ) :
                        (<SwipableFlatList allNotification={this.state.allNotification} />) }
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
    }  
})