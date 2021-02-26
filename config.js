import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyByNT4KC-KbqmSxCgjUWce49Cfacc3bfCA",
    authDomain: "book-santa-app-aa444.firebaseapp.com",
    projectId: "book-santa-app-aa444",
    storageBucket: "book-santa-app-aa444.appspot.com",
    messagingSenderId: "442291597583",
    appId: "1:442291597583:web:7eb69779e1277d72a34e7a"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();