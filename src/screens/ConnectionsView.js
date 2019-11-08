import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Button
} from 'react-native';
import {
  Divider,
  ListItem
} from 'react-native-elements';
import constants from "../helpers/constants";
import { connect } from "react-redux";
import {
  getEngagements,
  getDocuments,
  clearDocuments,
  clearEngagements
} from "../store/actions/connectionData";
import {
  Ionicons, AntDesign, MaterialCommunityIcons, Feather,
  MaterialIcons
} from '@expo/vector-icons';
import { Engagement, Documents } from '../components/ConnectionsViewTabs/ConnectionsViewTabs'
import { AuthSession } from 'expo';

function ConnectionsView(props) {
  const connectionData = props.navigation.getParam('connectionData').person
  const [tabs, setTabs] = useState({
    engagement: true,
    docs: false
  })


  useEffect(() => {
    props.getEngagements(props.navigation.getParam('connectionData').person.pk)
    props.getDocuments(props.navigation.getParam('connectionData').person.pk)
  }, [false])

  const styles = StyleSheet.create({
    tabs: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: 'center',
      overflow: "hidden",
      borderWidth: 1,
      borderColor: constants.highlightColor,
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
    },

    selected: {
      backgroundColor: constants.highlightColor,
      color: "white",
      overflow: "hidden"
    },

    tab: {
      width: "50%",
      height: 40,
      fontSize: 16,
      textAlign: 'center',
      paddingTop: 8,

    },

    iconStyles: {
      fontSize: 32,
      color: constants.highlightColor,
      width: 32,
      height: 32,
      marginHorizontal: 10
    }
  })

  const leftArrow = '\u2190';

  return (


      
    <View style={{ maxHeight: '100%'}}>
          <TouchableHighlight
        underlayColor="lightgray"
        style={{ padding: 7.5 }}
        onPressIn={() => {
          props.navigation.goBack()
        }}
      >
        <Text
          style={{
            marginLeft: 5,
            fontSize: 15
          //   padding: 10,
          //   borderRadius: 4,
          //   borderWidth: 1,
          //   borderColor: `${constants.highlightColor}`,
          //   color: `${constants.highlightColor}`
          }}
        >
          {leftArrow} {props.navigation.getParam('childName').toUpperCase()}
        </Text>
      </TouchableHighlight>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          // borderColor: 'yellow',
          // borderWidth: 1
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 5,
            width: "85%",
            // borderColor: 'green',
            // borderWidth: 1
          }}
        >
          <View>
            {/* <View style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              // width: "85%"
            }}>
              <Text style={{ fontSize: 20 }}>{connectionData.full_name}</Text>
              <ListItem
                leftAvatar={{
                  source: {
                    uri:
                      connectionData.picture ||
                      "https://www.trzcacak.rs/myfile/full/214-2143533_default-avatar-comments-default-avatar-icon-png.png"
                  }
                }}
              >{}</ListItem>
              <View style={{ maxWidth: "60%" }}>
                {connectionData.Email ? <Text style={{ padding: 5 }}>Email: {connectionData.email}</Text> : null}
                <Text style={{ padding: 5 }}>Phone: {connectionData.telephone}</Text>
                <Text style={{ padding: 5 }}>Residence: {connectionData.address}</Text>
              </View>
            </View> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
                width: "85%",
                // borderColor: 'blue',
                // borderWidth: 1
              }}
            >
              <View>
                <Text style={{ fontSize: 20 }}>{connectionData.full_name}</Text>
                <ListItem
                  leftAvatar={{
                    source: {
                      uri:
                        connectionData.picture ||
                        "https://www.trzcacak.rs/myfile/full/214-2143533_default-avatar-comments-default-avatar-icon-png.png"
                    }
                  }}
                />
              </View>
              <View style={{ maxWidth: "60%" }}>
                {connectionData.email ? <Text style={{ padding: 5 }}>Email: {connectionData.email}</Text> : null}
                {connectionData.telephone ? <Text style={{ padding: 5 }}>Phone: {connectionData.telephone}</Text> : null}
                {connectionData.address && connectionData.address.formatted ? <Text style={{ padding: 5 }}>Residence: {connectionData.address.formatted}</Text> : null}
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "95%",
          alignItems: 'center',
        }}
      >
      </View>
      <View 
        style={{
          borderRadius: 4,
          borderColor: '#c4c4c4',
          borderWidth: 0.5,
          width: '95%',
          marginLeft: '2%',
          alignItems: 'center',
          alignContent: "center"
        }}
      >
      <View style={styles.tabs}>
        <Text
          style={[styles.tab, tabs.engagement ? styles.selected : null, {borderTopRightRadius: 10, borderTopLeftRadius: 10}]}
          onPress={() => {
            setTabs({
              engagement: true,
              docs: false,
            });
          }}
        >
          Engagements
        </Text>
        <Text
          style={[styles.tab, tabs.docs ? styles.selected : null, {borderTopRightRadius: 10, borderTopLeftRadius: 10}]}
          onPress={() => {
            setTabs({
              engagement: false,
              docs: true,
            });
          }}
        >
          Documents
        </Text>
      </View>


      {
        tabs.engagement ?
          <View>
            <View 
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                margin: 5,
                // borderColor: 'orange',
                // borderWidth: 1
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('MyAccount')
                }}
              >
                <Ionicons
                  name='ios-document'
                  style={styles.iconStyles}
                />
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('MyAccount')
                }}
              >
                <AntDesign
                  name='file1'
                  style={styles.iconStyles}
                />
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('MyAccount')
                }}
              >
                <Feather
                  name='phone'
                  style={styles.iconStyles}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('MyAccount')
                }}
              >
                <MaterialIcons
                  name='email'
                  style={styles.iconStyles}
                />
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('MyAccount')
                }}
              >
                <MaterialCommunityIcons
                  name='clock'
                  style={styles.iconStyles}
                />
              </TouchableWithoutFeedback>
            </View>

            <ScrollView style={{ maxHeight: '80%' }}>
              <View>
                {
                  props.engagements.map((engagement) => {
                    return (
                      <Engagement key={engagement.pk} engagement={engagement} />)
                  })}
              </View>
            </ScrollView>
          </View>
          : null
      }

      {
        tabs.docs ?
          // <View style={{borderWidth: 2}}>
            <ScrollView style={{maxHeight: '100%', width: '80%'}} >
              {/* <View> */}
                {
                  props.documents.map((document) => {
                    console.log('pk' + ' ' + document.pk)
                    return (
                      <Documents key={document.pk} document={document} />)
                  })}
              {/* </View> */}
            </ScrollView>
          // </View> 
          : null
      }
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    engagements: state.connection.engagements,
    isLoadingEngagements: state.connection.isLoadingEngagements,
    engagementsError: state.connection.engagementsError,
    documents: state.connection.documents,
    isLoadingDocuments: state.connection.isLoadingDocuments,
    documentsError: state.connection.documentsError
  }
}

export default connect(
  mapStateToProps,
  {
    getEngagements,
    clearEngagements,
    getDocuments,
    clearDocuments
  }
)(ConnectionsView);