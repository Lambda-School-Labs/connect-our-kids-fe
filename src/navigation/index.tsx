import React from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import {
    createAppContainer,
    createSwitchNavigator,
    NavigationScreenConfig,
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import AboutScreen from '../screens/AboutScreen';
import FamilyConnectionsScreen from '../screens/FamilyConnectionsScreen';
import PeopleSearchScreen from '../screens/PeopleSearchScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import constants from '../helpers/constants';
import AuthenticationView from '../screens/AuthenticationScreen';
import CaseScreen from '../screens/CaseScreen';
import RelationshipScreen from '../screens/RelationshipScreen';
import AddDocumentForm from '../components/family-connections/AddDocumentForm';
import logoImg from '../../assets/logo.png';
import MoreScreen from '../screens/MoreScreen';
import AddEngagementForm from '../components/family-connections/AddEngagementForm/AddEngagementForm';
import styles from './styles';
import AddCaseScreen from '../screens/AddCaseScreen';

// This is the primary NAVIGATION file. Everything in this file determines how to navigate around through the Bottom Navbar and "More" Drawer.
// If you add new screens into the app, you'll need to add them into the appropriate stacks below in order for React Navigation to know how to route the user.
// refer to React navigation docs for more details: https://reactnavigation.org/docs/en/bottom-tab-navigator.html
// Custom drawer code can be found in navigation > CustomDrawer.js

// use this on the three top level screens (People Search, Family Connections, and More)
const topLevelScreenNavigationOptions: NavigationScreenConfig<
    Record<string, unknown>,
    unknown
> = {
    headerStyle: {
        height: constants.headerHeight,
        backgroundColor: constants.backgroundColor,
    },
    // eslint-disable-next-line react/display-name
    headerTitle: () => (
        <View style={styles.headerStyles}>
            <Image
                style={styles.headerImgStyles}
                source={logoImg}
                resizeMode="contain"
            />
        </View>
    ),
};

// use this on the top level screen with Add Case Button (Family Connections)
const topLevelScreenNavigationOptions2: NavigationScreenConfig<
    Record<string, unknown>,
    unknown
> = {
    headerStyle: {
        height: constants.headerHeight,
        backgroundColor: constants.backgroundColor,
    },
    // eslint-disable-next-line react/display-name
    headerTitle: (props) => (
        <View style={styles.headerStyles}>
            <Image
                style={styles.headerImgStyles}
                source={logoImg}
                resizeMode="contain"
            />
            <TouchableOpacity
                style={styles.headerBtnView}
                activeOpacity={0.6}
                onPress={() => console.log('clicked')}
            >
                <Ionicons name="md-add" size={24} color="#0279AC" />
                <Text style={styles.addCaseText}> Add Case </Text>
            </TouchableOpacity>
        </View>
    ),
};

// use this on sublevel screens, such as Case, Connection, and document views
const subLevelScreenNavigationOptions: NavigationScreenConfig<
    Record<string, unknown>,
    unknown
> = {
    headerTintColor: constants.highlightColor,
    headerStyle: {
        height: constants.headerHeight,
        backgroundColor: constants.backgroundColor,
    },
    headerBackTitleStyle: {
        color: constants.highlightColor,
    },
    headerTitleStyle: {
        display: 'none',
    },
};

// Following StackNavigators are in BottomNav:
const FamilyConnectionsNavigator = createStackNavigator({
    FamilyConnections: {
        screen: FamilyConnectionsScreen,
        navigationOptions: topLevelScreenNavigationOptions2,
    },
    CaseView: {
        screen: CaseScreen,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back to Cases',
        },
    },
    RelationshipScreen: {
        screen: RelationshipScreen,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back to Case',
        },
    },
    AddEngagementForm: {
        screen: AddEngagementForm,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back to Connection',
        },
    },
    DocumentForm: {
        screen: AddDocumentForm,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back to Connection',
        },
    },
});

const PeopleSearchNavigator = createStackNavigator({
    PeopleSearch: {
        screen: PeopleSearchScreen,
        navigationOptions: topLevelScreenNavigationOptions,
    },
    SearchResult: {
        screen: SearchResultScreen,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back to Search',
        },
    },
});

// Following StackNavigators are inside "More" drawer:

const CustomDrawerNavigator = createStackNavigator({
    More: {
        screen: MoreScreen,
        navigationOptions: topLevelScreenNavigationOptions,
    },
    MyAccount: {
        screen: AuthenticationView,
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back',
        },
    },
    About: {
        screen: AboutScreen,
        // initialRouteName: 'About',
        navigationOptions: {
            ...subLevelScreenNavigationOptions,
            headerBackTitle: 'Back',
        },
    },
});

// BottomNavigator determines the items/icons that show on the very bottom of the app.
// 'People Search', 'Family Connections', and 'More'
const BottomNavigator = createBottomTabNavigator(
    {
        PeopleSearchNavigator: {
            screen: PeopleSearchNavigator,
            navigationOptions: {
                tabBarLabel: 'PEOPLE SEARCH',
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="md-search" size={36} color={tintColor} />
                ),
            },
        },

        FamilyConnections: {
            screen: FamilyConnectionsNavigator,
            navigationOptions: {
                tabBarLabel: 'FAMILY CONNECTIONS',
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="md-people" size={36} color={tintColor} />
                ),
            },
        },

        MoreNavigator: {
            screen: CustomDrawerNavigator,
            navigationOptions: {
                tabBarLabel: 'MORE',
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-menu" size={36} color={tintColor} />
                ),
            },
        },
    },

    {
        initialRouteName: 'PeopleSearchNavigator',
        tabBarOptions: {
            inactiveTintColor: 'rgba(24, 23, 21, 0.5)',
            activeTintColor: '#0279AC',
            style: {
                backgroundColor: '#FFFFFF',
                height: 55,
                paddingTop: 3,
                paddingBottom: 3,
                justifyContent: 'space-between',
                width: '100%',
            },
        },
    }
);

const AppBottomSwitchNavigator = createSwitchNavigator({
    FamilyConnections: { screen: BottomNavigator },
    PeopleSearch: { screen: BottomNavigator },
    More: { screen: CustomDrawerNavigator },
});

const AppContainer = createAppContainer(AppBottomSwitchNavigator);
export default AppContainer;
