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
            allBookRecived: [],
        }

        this.recivedBooksRef = null;
    }

    getBooksRecived = () => {
        this.recivedBooksRef = db.collection("requested_books").where("book_status", "==", "recived").where("user_Id", "==", this.state.userID)
        .onSnapshot((snapshot) => {
            var allBookRecived = [];
            snapshot.docs.map((doc) => {
                var books = doc.data();
                books["doc_id"] = doc.id;
                allBookRecived.push(books);
            })

            this.setState({allBookRecived: allBookRecived});
        })
    }

    componentDidMount() {
        this.getBooksRecived();
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ( {item, index} ) => ( 
        <ListItem key={index}
        title={item.book_name}
        leftElement = {<Icon name = "book" type = "font-awesome" color ='#696969'/>}
        titleStyle = {{ color: 'black', fontWeight: 'bold' }}
        bottomDivider />
    )

    render() {
        return (
            <View style={styles.container}>
                <View style = {{flex: 0.1}}>
                    <MyHeader navigation={this.props.navigation} 
                    title="Books Recived" /> 
                    <View style={{flex:1}}>
                        { this.state.allBookRecived.length === 0 ? 
                        (<View style={styles.subtitle}>
                            <Text style={{ fontSize: 20}}>
                                You have Not Recived any Books
                            </Text>
                        </View> ) :
                        (<FlatList keyExtractor={this.keyExtractor}
                        data={this.state.allBookRecived}
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
    }  
})