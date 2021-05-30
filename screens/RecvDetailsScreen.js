import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class RecvDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      recieverId      : this.props.navigation.getParam('details')["userName"],
      requestId       : this.props.navigation.getParam('details')["exchageId"],
      itemName        : this.props.navigation.getParam('details')["itemName"],
      reason_for_requesting : this.props.navigation.getParam('details')["Description"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }



getRecieverDetails=()=>{
  db.collection('Users').where('EmailId','==',this.state.recieverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().firstName,
        recieverContact : doc.data().mobileNumber,
        recieverAddress : doc.data().Address,
      })
    })
  });

  db.collection('exchangeRequests').where('exchageId','==',this.state.requestId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}
getUserDetalis=(userId)=>{
  db.collection('Users').where('EmailId','==',userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      this.setState({
        userName:doc.data().firstName+" "+doc.data().lastName
      })
    })
  })
}
updateBookStatus=()=>{
  db.collection('all_donations').add({
    book_name           : this.state.itemName,
    request_id          : this.state.requestId,
    requested_by        : this.state.recieverName,
    donor_id            : this.state.userId,
    request_status      :  "Donor Interested"
  })
}

addNotification=()=>{
  alert("in notifaction")
  var msg=this.state.userId+" Has shown intresed in exchange the item"
  db.collection("all_notifications").add({
    "targeted_user_id"    : this.state.recieverId,
    "donor_id"            : this.state.userId,
    "exchageId"          : this.state.requestId,
    "itemName"           : this.state.itemName,
    "date"                : firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status" : "unread",
    "message"             : msg
  })
}

componentDidMount(){
  this.getRecieverDetails()
  this.getUserDetalis(this.state.userId)
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Donate item", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Description : {this.state.reason_for_requesting}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBookStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyBartersScreen')
                  }}
                >
                <Text>I want to Donate</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})