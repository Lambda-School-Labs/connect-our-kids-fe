import React, { Component, useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  StatusBar,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
  TouchableHighlight,
  Alert
} from "react-native";
import { connect } from "react-redux";
import {
  getCaseData,
  getUserCases,
  setUserCreds,
  setModalVisible
} from "../store/actions"
import axios from "axios";
import {
  ListItem,
  Image,
  SearchBar,
  Button,
  CheckBox,
  Divider
} from "react-native-elements";
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';

// import { Picker } from 'react-native-picker-dropdown';
import constants from "../helpers/constants";

// import screen components
// discontinued work on AddCaseScreen. Button and Modal also commented out below
// import AddCaseScreen from "./AddCaseScreen";
import CaseViewScreen from "./CaseViewScreen.js";
import ConnectionsLogin from "../components/Authentication/ConnectionsLogin"
import Loader from "../components/Loader/Loader";
import ScrollToTop from '../UI/ScrollToTop';


const FamilyConnectionsScreen = (props) => {
  
  const initialState = {
    searchKeywords: "",
    gender: "Gender",
    ageRange: "Age Range",
    sortBy: "Sort By",
    modalVisible: false,
    filters: {
      male: false,
      female: false,
      unspecified: false,
      zero_five: false,
      six_nine: false,
      ten_thirteen: false,
      fourteen_eighteen: false,
      name: false,
      DOB: false,
      created: false,
      updated: false
    },
    caseVisible: false,
    addCaseModalVisible: true,
    pk: '',
    isLoggedIn: false
  }
  const [state, setState] = useState(initialState)

  const genderAssignment = (gender) => {
    if (gender === 'M') {
      return 'Male'
    } else if (gender === 'F') {
      return 'Female'
    } else if (gender === 'O') {
      return 'Unspecified Gender'
    } else {
      return null
    }
  }

  goToTop = () => {
    scroll.scrollTo({x: 0, y: 0, animated: true});
 } 

  useEffect(() => {
    props.getUserCases()
    console.log('FamilyConnectionsAccessToken', props.accessToken)
  }, [props.accessToken])
 
  const setModalVisible = (visible) => {
    setState({ ...state, modalVisible: visible });
  }

  const setAddCaseModalVisible = (visible) => {
    setState({ ...state, addCaseModalVisible: visible });
  }

  const setCaseVisible = (visible) => {
    setState({ ...state, caseVisible: visible });
  }

  const handleKeywordChange = event => {
    setState({
      ...state,
      searchKeywords: event
    });
    // console.log(state.searchKeywords);
  };

  // ------GENDER FILTER functionality------
  let filteredCases = props.results; // state.results

  if (
    !state.filters.male &&
    !state.filters.female &&
    !state.filters.unspecified
  ) {
    //if nothing is selected -- do nothing
  } else {
    if (!state.filters.male) {
      filteredCases = filteredCases.filter(c => c.gender !== "M");
    } // if male is not selected -- remove all males
    if (!state.filters.female) {
      filteredCases = filteredCases.filter(c => c.gender !== "F");
    }
    if (!state.filters.unspecified) {
      filteredCases = filteredCases.filter(c => c.gender !== "O");
    }
  }

  // ------SORTING Functionality------
  const name = (a, b) => {
    const A = a.full_name.toUpperCase();
    const B = b.full_name.toUpperCase();
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  const lastName = (a, b) => {
    const A = a.last_name.toUpperCase();
    const B = b.last_name.toUpperCase();
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  const created = (a, b) => {
    const A = a.created_at;
    const B = b.created_at;
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  const updated = (a, b) => {
    const A = a.updated_at;
    const B = b.updated_at;
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  if (state.filters.name) {
    filteredCases.sort(lastName);
  } else if (state.filters.created) {
    filteredCases.sort(created);
  } else if (state.filters.updated) {
    filteredCases.sort(updated);
  } else {
    filteredCases.sort(name);
  }

  // ------SEARCHBAR functionality - filters by case first_name or last_name---------
  let SearchedCases = filteredCases.filter(result => {
    return result.full_name.toLowerCase().indexOf(state.searchKeywords.toLowerCase()) != -1;
  });

  return (
    props.isLoading ?
      <Loader /> :
      props.results[0] ?
      <SafeAreaView>
        <View 
          style={{ flexDirection: "column", alignItems: 'flex-start', justifyContent: 'flex-start' }}
        >
          <SearchBar
            inputStyle={{ fontSize: 16 }}
            inputContainerStyle={{ backgroundColor: '#FAFAFA', height: 45.62 }}
            placeholder="Search Name..."
            placeholderTextColor="#8D8383"
            // lightTheme
            round
            name="searchKeywords"
            value={state.searchKeywords}
            onChangeText={handleKeywordChange}
            // create searchbar target platform.os
            platform="ios"
            containerStyle={styles.searchBar}
          />
          <TouchableHighlight
            onPressIn={() => {
              setModalVisible(true);
            }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}
            >
              <MaterialIcons
                name="filter-list"
                color='black'
                size={32}
              /><Text style={{ fontSize: 16 }}>Filter</Text>
            </View>
          </TouchableHighlight>
        </View>

        {/* FILTERS BUTTON - onPress Modal */}
        <Modal
          animationType="fade"
          transparent={false}
          visible={state.modalVisible}
        >
          <ScrollView scrollsToTop>
            <View
              style={{
                marginTop: 100,
                // justifyContent: "space-evenly",
                alignSelf: "left"
              }}
            >
              <Text
                style={{ margin: 20, fontSize: 20, fontWeight: "800", textAlign: "left" }}
              >
                Gender
              </Text>

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Male"
                size={16}
                checked={state.filters.male}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      male: !state.filters.male
                    }
                  })
                }
              />

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Female"
                size={16}
                checked={state.filters.female}
                // onPress={checkHandler}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      female: !state.filters.female
                    }
                  })
                }
              />

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Unspecified"
                size={16}
                checked={state.filters.unspecified}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      unspecified: !state.filters.unspecified
                    }
                  })
                }
              />

              {/* <Divider
                style={{ height: 1, backgroundColor: "lightgray", margin: 20 }}
              /> */}

              <Text
                style={{ margin: 20, fontSize: 20, fontWeight: "800", textAlign: "left" }}
              >
                Sort By
              </Text>

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Last Name"
                size={16}
                checked={state.filters.name}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      name: !state.filters.name,
                      DOB: false,
                      created: false,
                      updated: false
                    }
                  })
                }
              />

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Date Created"
                size={16}
                checked={state.filters.created}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      name: false,
                      DOB: false,
                      created: !state.filters.created,
                      updated: false
                    }
                  })
                }
              />

              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white"
                }}
                title="Last Updated"
                size={16}
                checked={state.filters.updated}
                onPress={() =>
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      name: false,
                      DOB: false,
                      created: false,
                      updated: !state.filters.updated
                    }
                  })
                }
              />
            </View>
          </ScrollView>
          <View
            style={{
              alignContent: "center",
              alignSelf: 'center',
              marginBottom: 200,
              width: 100,
              fontSize: 80,
              fontWeight: "bold",
            }}
          >
            <TouchableHighlight>
              <Button
                buttonStyle={{ backgroundColor: constants.highlightColor }}
                title="Apply"
                onPress={() => {
                  setModalVisible(!state.modalVisible);
                }}
              />
            </TouchableHighlight>
          </View>
        </Modal>

        {/* Case List Todos:
       Cache case info from API for faster loading */}
        {/* Case List View Starts Here */}
        <View style={{ paddingBottom: 170 }}>
          <ScrollView
            ref={(a) => {scroll = a}}
            contentInset={{bottom: constants.headerHeight}}
          >
            <ScrollToTop 
              onPress={goToTop}
            />
            {props.isLoading ? (
              <Loader />
            ) : (
                SearchedCases.map((result, index) => (
                  <ListItem
                    key={index}
                    title={result.full_name}
                    titleStyle={{ color: "#5A6064" }}
                    subtitle={`${
                      result.gender ?
                        genderAssignment(result.gender)
                        : "Unspecified Gender"
                      } ${result.birthday ? `Birthday: ${result.birthday}` : ''}`}
                    subtitleStyle={{ color: "#9FABB3" }}
                    leftAvatar={{ source: { uri: result.picture } }}
                    to pDivider={true}
                    onPress={async () => {
                      props.navigation.navigate('CaseView', { pk: result.pk, caseData: result })

                    }}
                  />
                ))
              )}
          </ScrollView>
        </View>
      </SafeAreaView>
      : 
      <ConnectionsLogin 
          setUserCreds={props.setUserCreds} 
          setModalVisible={props.setModalVisible}
        />
  )

} // end of FamilyConnectionsScreen

const styles = StyleSheet.create({
  searchBar: {
    marginRight: 5,
    marginLeft: 5,
    width: '97%',
    backgroundColor: Platform.OS === "ios" ? "white" : "white",
  },
  filterButton: {
    width: Platform.OS === "ios" ? 70 : 70,
    marginVertical: Platform.OS === "ios" ? 20 : 20,
    maxHeight: Platform.OS === "ios" ? 40 : 40,
  },
  isLoading: {
    textAlign: "center",
    fontSize: 20,
    flex: 1,
    marginTop: 240,
    color: "black"
  }
});

const mapStateToProps = state => {
  const {
    caseData
  } = state.caseData;
  const {
    results,
    isLoading,
    caseDataError,
  } = state.userCases;
  const {accessToken} = state.auth

  return {
    results,
    caseData,
    accessToken,
    isLoading,
    caseDataError,
  };
};

export default connect(
  mapStateToProps, {
  getUserCases,
  getCaseData,
  setUserCreds,
  setModalVisible
})(FamilyConnectionsScreen);