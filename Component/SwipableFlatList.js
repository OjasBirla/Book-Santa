import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';

import { ListItem, Icon } from 'react-native-elements';

import db from '../config';
import firebase from 'firebase';

export default class SwipableFlatList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allNotification: this.props.allNotification,
        }
    }

    updateMarkAsread = () => {
        db.collection("all_notifications").docs(Notification.doc_id).update({
            notification_status: "read"
        })
    }

    onSwipeValueChange = (swipeData) => {
        var allNotification = this.state.allNotification;

        const { key, value } = swipeData;

        if (value < -Dimensions.get("window").width) { 
            const newData = [...allNotifications]; 
            this.updateMarkAsread(allNotifications[key]); 
            newData.splice(key, 1); 
            this.setState({ allNotifications: newData });
        }
    }

    renderItem = (data) => {
        <ListItem title={data.item.book_name}
        subtitle = {data.item.message}
        leftElement = {<Icon name = "book" type = "font-awesome" color ='#696969'/>}
        titleStyle = {{ color: 'black', fontWeight: 'bold' }}
        bottomDivider />
    }
    renderHiddenItem = (data) => {
        <View style={styles.rowBack}>
            <View>
                <Text>Mark As Read</Text>
            </View>
        </View>
    }

    render() {
        return (
            <View style={StyleSheet.container}>
                <SwipeListView disableRightSwipe
                data={this.state.allNotification}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-Dimensions.get("window").width}
                previewRowKey={"0"}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange} 
                keyExtractor={(item, index) => index.toString()} />
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

    rowBack: { 
        alignItems: "center",
        backgroundColor: "#29b6f6", 
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingLeft: 15 
    },
})