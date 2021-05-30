import React,{Component} from 'react'
import {StyleSheet,View ,Text,TouchableOpacity } from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'
import db from '../config'
import {Icon,Avatar} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as  Permissions from 'expo-permissions'
import { RFValue } from "react-native-responsive-fontsize";
export default class CSBMenu extends Component{
    state={
        userId:firebase.auth().currentUser.email,
        image:'#',
        name:'',
        docId:''
    }
    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!cancelled) {
          this.uploadImage(uri, this.state.userId);
        }
      };
    
      uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();
    
        var ref = firebase
          .storage()
          .ref()
          .child("user_profiles/" + imageName);
    
        return ref.put(blob).then((response) => {
          this.fetchImage(imageName);
        });
        console.log(imageName)
      };
    
      fetchImage = (imageName) => {
        var storageRef = firebase
          .storage()
          .ref()
          .child("user_profiles/" + imageName);
    
        // Get the download URL
        storageRef
          .getDownloadURL()
          .then((url) => {
            this.setState({ image: url });
          })
          .catch((error) => {
            this.setState({ image: "#" });
          });
      };
    
      getUserProfile() {
        db.collection("Users")
          .where("EmailId", "==", this.state.userId)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({
                name: doc.data().FirstName + " " + doc.data().LastName,
                docId: doc.id,
                image: doc.data().image,
              });
            });
          });
      }
    
      componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
      }
    render(){
        return(
            <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#32867d",
              }}
            >
              <Avatar
                rounded
                source={{
                  uri: this.state.image,
                }}
                size={"xlarge"}
                onPress={() => this.selectPicture()}
                showEditButton
              />
    
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: RFValue(20),
                  color: "#fff",
                  padding: RFValue(10),
                }}
              >
                {this.state.name}
              </Text>
            </View>
            <View style={{ flex: 0.6 }}>
              <DrawerItems {...this.props} />
            </View>
            <View style={{ flex: 0.1 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                }}
                onPress={() => {
                  this.props.navigation.navigate("WelcomeScreen");
                  firebase.auth().signOut();
                }}
              >
                <Icon
                  name="logout"
                  type="antdesign"
                  size={RFValue(20)}
                  iconStyle={{ paddingLeft: RFValue(10) }}
                />
    
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontWeight: "bold",
                    marginLeft: RFValue(30),
                  }}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
     )
 }
}
const styles = StyleSheet.create({
drawerContaner:{
 flex:1,
 justifyContent:'flex-end',
 paddingBottom:30
},
LogoutButton:{
 justifyContent:'center',
 padding:10,
 height:30,
 width:'100%'
},
drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
})