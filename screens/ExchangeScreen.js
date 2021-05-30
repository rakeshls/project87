import React, { Component } from "react";
import {View, StyleSheet, Text,TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView} from "react-native";
import db from "../config";
import firebase from "firebase"
import MyHeader from "../components/MyHeader";
import {SafeAreaProvider} from 'react-native-safe-area-context'

export default class RequesteItemScreen extends Component {
  constructor() {
    super();
    this.state = {
      userName: firebase.auth().currentUser.email,
      itemName: "",
      description: "",      
      requestid:'',
      IsBookRequestActive:'',
      requestedItemName:'',
      itemStatus:'',
      userDocId:'',
      docId:'',
      dataSource:'',
      showFlatList:false
    };
  }
  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem =async (itemName, description) => {
    var userName = this.state.userName;
    var random = this.createUniqueId()
    db.collection('exchangeRequests').add({
      "userName": userName,
      "itemName": itemName,
      "Description": description,
      "exchageId": random,
      "date":firebase.firestore.FieldValue.serverTimestamp()
    })
    await this.getBookRequest()
    db.collection('Users').where("EmailId","==",userName).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('Users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
   })
   
    this.setState({
      itemName: '',
      description: '',
      requestid: random
    })

    return alert("Item Requested Successfully")
  }

  receivedBooks=(ItemName)=>{
    var userName = this.state.userName
    var requestId = this.state.requestId
    db.collection('receivedItems').add({
        "userId": userName,
        "itemName":itemName,
        "requestId"  : requestId,
        "itemStatus"  : "received",
  
    })
  }
  getIsBookRequestActive(){
    db.collection('Users')
    .where('EmailId','==',this.state.userName)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsBookRequestActive:doc.data().IsBookRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  getBookRequest =()=>{
    // getting the requested book
  var bookRequest=  db.collection('requestedItems')
    .where('userId','==',this.state.userName)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().itemStatus !== "received"){
          this.setState({
            requestId : doc.data().requestId,
            requestedItemName: doc.data().itemName,
            bookStatus:doc.data().itemStatus,
            docId     : doc.id
          })
        }
      })
  })}
  sendNotification=()=>{
    //to get the first name and last name
    db.collection('Users').where('EmailId','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstName
        var lastName = doc.data().lastName
  
        // to get the donor id and book nam
        db.collection('all_notifications').where('exchageId','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().exchageId
            var itemName =  doc.data().itemName
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the Items " + itemName ,
              "notification_status" : "unread",
              "itemName" : itemName
            })
          })
        })
      })
    })
  } 
    componentDidMount(){
    this.getBookRequest()
    this.getIsBookRequestActive()
  } 
  updateBookRequestStatus=()=>{
    //updating the book status after receiving the book
    db.collection('requestedItem').doc(this.state.docId)
    .update({
      itemStatus : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('Users').where('EmailId','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('Users').doc(doc.id).update({
          IsBookRequestActive: false
        })
      })
    })    
  }
  render() {
    if(this.state.IsBookRequestActive === true){
      return(
        <SafeAreaProvider>
        <View style = {{flex:1,justifyContent:'center'}}>
        <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
        <Text> Item Name </Text>
        <Text>{this.state.requestedBookName}</Text>
        </View>
        <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
        <Text> Item Status </Text>

        <Text>{this.state.bookStatus}</Text>
        </View>

        <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
        onPress={()=>{
          this.sendNotification()
          this.updateBookRequestStatus();
          this.receivedBooks(this.state.requestedBookName)
        }}>
        <Text>I recieved the item </Text>
        </TouchableOpacity>
      </View>
       </SafeAreaProvider>
      )
    }
    else{
      return(
        <SafeAreaProvider>
        <View style={{flex:1}}>
        <MyHeader title="Request Item" navigation ={this.props.navigation}/>

        <View>

        <TextInput  
        style={styles.formTextInput}
              placeholder={"item name"}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
        />

    {  this.state.showFlatlist ?

      (  <FlatList
      data={this.state.dataSource}
      renderItem={this.renderItem}
      enableEmptySections={true}
      style={{ marginTop: 10 }}
      keyExtractor={(item, index) => index.toString()}
    /> )
    :(
      <View style={{alignItems:'center'}}>
      <TextInput
        style ={[styles.formTextInput,{height:300}]}
        multiline
        numberOfLines ={8}
        placeholder={"Why do you need the item"}
        onChangeText ={(text)=>{
            this.setState({
                description:text
            })
        }}
        value ={this.state.description}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{ this.addItem(this.state.itemName,this.state.description);
        }}
        >
        <Text>Request item</Text>
      </TouchableOpacity>
      </View>
    )
   }
          </View>
      </View>
      </SafeAreaProvider>
      )
      }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button: {
    width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
    },
});
