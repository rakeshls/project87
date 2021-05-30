import React,{Component} from 'react'
import {View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity} from 'react-native'
import {ListItem, Icon} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
import {SafeAreaProvider} from 'react-native-safe-area-context'
export default class MyBartersScreen extends Component{
    constructor(){
        super()
        this.state={
                donorId:firebase.auth().currentUser.email,
                allBarters:[]
        }
        this.requestRef=null
    }
 static navigationOptions={header:null}
 getDonorDetails=(donorId)=>{
    db.collection('Users').where('EmailId','==',donorId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=> {
            this.setState({
                'donorName':doc.data().firstName
                +" "+ doc.data().lastName
            })
        });
    })
   }
   getAllBarters =()=>{
    this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.donorId)
    .onSnapshot((snapshot)=>{
      var allDonations = []
      snapshot.docs.map((doc) =>{
        var donation = doc.data()
        donation["doc_id"] = doc.id
        allDonations.push(donation)
      });
      this.setState({
        allDonations : allDonations
      });
    })
  }
  sendBook=(bookDetails)=>{
    if(bookDetails.request_status === "Book Sent"){
      var requestStatus = "Donor Interested"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status" : "Donor Interested"
      })
      this.sendNotification(bookDetails,requestStatus)
    }
    else{
      var requestStatus = "Item Sent"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status" : "Item Sent"
      })
      this.sendNotification(bookDetails,requestStatus)
    }
  }
  sendNotification=(bookDetails,requestStatus)=>{
    var requestId = bookDetails.exchageId
    var donorId = bookDetails.donor_id
    db.collection("all_notifications")
    .where("exchageId","==", requestId)
    .where("donor_id","==",donorId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(requestStatus === "item Sent"){
          message = this.state.donorName + " sent you book"
        }else{
           message =  this.state.donorName  + " has shown interest in donating the book"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }
  keyExtractor = (item, index) => index.toString()
      
  renderItem = ( {item, i} ) =>(
    <ListItem
      key={i}
      title={item.book_name}
      subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
      leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
          <TouchableOpacity
           style={[
             styles.button,
             {
               backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
             }
           ]}
           onPress = {()=>{
             this.sendBook(item)
           }}
          >
            <Text style={{color:'#ffff'}}>{
              item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
            }</Text>
          </TouchableOpacity>
        }
      bottomDivider
    />
  )
componentDidMount(){
    this.getDonorDetails(this.state.donorId)
    this.getAllBarters()
}
componentWillUnmount(){
  this.requestRef()
}
    render(){
        return(
            <SafeAreaProvider>
            <View>
          <MyHeader navigation={this.props.navigation} title="My Barters"/>
        <View style={{flex:1}}>
          {
            this.state.allBarters.length === 0
            ?(
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20}}>List of all book Donations</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allBarters}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
            </View>
            </SafeAreaProvider>
        )
    }
}
const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })