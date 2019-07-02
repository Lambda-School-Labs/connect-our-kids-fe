import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
<<<<<<< HEAD
import LoginWithAuth0 from '../components/Authentication/LoginWithAuth0';
=======
import LoginWithAuth0 from '../components/Authentication/LoginWithAuth0'
>>>>>>> efe6c19c3133c68c925f8c7cfc33ef2b3cb45d08
import { connect } from 'react-redux';
import RegisterModalsContainer from '../components/AuthModals/RegisterModalsContainer';
import {
  setModalVisible,
  setAgreeModalVisible,
  setVideoPlayerModalVisible,
  setUserCreds
} from '../store/actions';
import authHelpers from '../helpers/authHelpers';
class AuthenticationView extends Component {
  render() {
    return (
      <View style={styles.registerContainer}>
        <RegisterModalsContainer
          modalVisible={this.props.modalVisible}
          setAgreeModalVisible={this.props.setAgreeModalVisible}
          videoAgree={this.props.videoAgree}
          videoVisible={this.props.videoVisible}
          setModalVisible={this.props.setModalVisible}
          setVideoPlayerModalVisible={this.props.setVideoPlayerModalVisible}
          onLogin={() =>
            authHelpers.handleLogin(
              authHelpers._loginWithAuth0,
              this.props.setUserCreds
            )
          }
        />
        {!this.props.modalVisible && (
          <LoginWithAuth0
            navigation={this.props.navigation}
            setModalVisible={this.props.setModalVisible}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    marginHorizontal: 5
    // alignItems: 'center',
    // justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  const { modalVisible, videoAgree, videoVisible } = state.auth;
  return { modalVisible, videoAgree, videoVisible };
};

export default connect(
  mapStateToProps,
  {
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    setUserCreds
  }
)(AuthenticationView);
