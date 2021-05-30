import firebase from 'firebase'
require('@firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCD9u8p3hU2QC1f1CMY2Ll9OnhRtmQKzTc",
  authDomain: "barter-system-app-bc020.firebaseapp.com",
  projectId: "barter-system-app-bc020",
  storageBucket: "barter-system-app-bc020.appspot.com",
  messagingSenderId: "63692387084",
  appId: "1:63692387084:web:cb629338b7a0afc5870f29"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig); 
export default  firebase.firestore()
