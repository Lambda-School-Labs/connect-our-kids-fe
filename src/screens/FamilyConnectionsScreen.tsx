import React, { useState, useEffect } from 'react';

// RN component imports
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Modal,
    ScrollView,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import { ListItem, Image, SearchBar, CheckBox } from 'react-native-elements';

// redux
import { connect } from 'react-redux';

import {
    getCases,
    setUserCreds,
    setModalVisible,
    authChecker,
} from '../store/actions';

// constants = like a config variable
import constants from '../helpers/constants';

import ConnectionsLogin from '../components/auth/ConnectionsLogin';
import Loader from '../components/Loader';

// 3rd party imports like icons & scroll functionality
import ScrollToTop from '../UI/ScrollToTop';
import { MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

/**********************************************************/

// placeholder image for non-logged in users?
import placeholderImg from '../../assets/profile_placeholder.png';
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import {
    casesDetailSlim_cases,
    casesDetailSlim_cases_person,
} from '../generated/casesDetailSlim';
// unicode arrow
const leftArrow = '\u2190';

interface StateProps {
    accessToken: string;
    loadingUser: boolean;
    cases: casesDetailSlim_cases[];
    isLoadingCases: boolean;
    casesError: string;
}

interface DispatchProps {
    getCases: typeof getCases;
    setUserCreds: typeof setUserCreds;
    setModalVisible: typeof setModalVisible;
    authChecker: typeof authChecker;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

// this is like a local "store" -- used to initialize some state values, accessed in [state] hook
const FamilyConnectionsScreen = (props: Props): JSX.Element => {
    const styles = StyleSheet.create({
        searchBar: {
            marginRight: 5,
            marginLeft: 5,
            width: '75%',
            backgroundColor: Platform.OS === 'ios' ? 'white' : 'white',
        },
        filterButton: {
            width: Platform.OS === 'ios' ? 70 : 70,
            marginVertical: Platform.OS === 'ios' ? 20 : 20,
            maxHeight: Platform.OS === 'ios' ? 40 : 40,
        },
        isLoading: {
            textAlign: 'center',
            fontSize: 20,
            flex: 1,
            marginTop: 240,
            color: 'black',
        },
        checkboxes: {
            fontSize: 18,
            fontWeight: 'normal',
        },
    });

    const initialState = {
        searchKeywords: '',
        gender: 'Gender',
        ageRange: 'Age Range',
        sortBy: 'Sort By',
        modalVisible: false,
        filters: {
            male: false,
            female: false,
            unspecified: false,
            zero_five: false, // these are age groups, possibly not yet implemented in filters
            six_nine: false,
            ten_thirteen: false,
            fourteen_eighteen: false,
            name: false,
            last: false,
            DOB: false,
            created: false,
            updated: false,
        },
        caseVisible: false,
        addCaseModalVisible: true, // cannot currently add case to app, state not needed?
        pk: '',
    };

    // STATE HOOKS
    const [state, setState] = useState(initialState);
    const [isScrolling, setIsScrolling] = useState(false); // used to show "scroll to top" buttons; look into RN component that does this?
    const [options] = useState({ x: 0, y: 0, animated: true }); // used as landing coordinates for scroll to top
    const [sort, setSort] = useState('Full Name'); // sort results of Family Connections, can be changed to several other values
    const [rtn, setRtn] = useState('RETURN'); // MIGHT display "RETURN" next to a return arrow in iOS modals; also exists in the CaseView component

    const genderAssignment = (gender) => {
        // also exists in the CaseView component
        if (gender === 'M') {
            return 'Male';
        } else if (gender === 'F') {
            return 'Female';
        } else if (gender === 'O') {
            return '';
        } else {
            return '';
        }
    };

    // run this once
    useEffect(() => {
        Platform.OS === 'android' ? setRtn('') : null; // if Android, display no "RETURN" text, otherwise do nothing => probs better written as Platform.OS === 'android' && setRtn('')
    }, []);

    // run any time there a change to user loading
    useEffect(() => {
        props.authChecker();
    }, [props.loadingUser, props.accessToken]);

    // run any time the token changes
    useEffect(() => {
        if (props.accessToken) {
            props.getCases();
        }
    }, [props.accessToken]);

    const setModalVisible = (visible: boolean) => {
        setState({ ...state, modalVisible: visible });
    };

    const handleKeywordChange = (event) => {
        setState({
            ...state,
            searchKeywords: event,
        });
    };

    // ------GENDER FILTER functionality------
    let filteredCases = props.cases;

    if (
        !state.filters.male &&
        !state.filters.female &&
        !state.filters.unspecified
    ) {
        // if nothing is selected -- do nothing
    } else {
        if (!state.filters.male) {
            filteredCases = filteredCases.filter(
                (c) => c.person.gender !== 'M'
            );
        } // if male is not selected -- remove all males
        if (!state.filters.female) {
            filteredCases = filteredCases.filter(
                (c) => c.person.gender !== 'F'
            );
        }
        if (!state.filters.unspecified) {
            filteredCases = filteredCases.filter(
                (c) => c.person.gender !== 'O'
            );
        }
    }

    if (state.filters.last) {
        console.log('Sorting by last name');
        filteredCases.sort((a, b) =>
            a.person.lastName.localeCompare(b.person.lastName, undefined, {
                sensitivity: 'accent',
            })
        );
    } else if (state.filters.created) {
        // TODO
        filteredCases.sort((a, b) =>
            a.person.createdAt.localeCompare(b.person.createdAt)
        );
    } else if (state.filters.updated) {
        filteredCases.sort((a, b) =>
            a.person.updatedAt.localeCompare(b.person.updatedAt)
        );
    } else {
        // default. sort by first name
        filteredCases.sort((a, b) =>
            a.person.fullName.localeCompare(b.person.fullName, undefined, {
                sensitivity: 'accent',
            })
        );
    }

    // ------SEARCH BAR functionality - filters by case first_name or last_name---------
    const SearchedCases = filteredCases.filter((result) => {
        return (
            result.person.firstName
                .toLowerCase()
                .indexOf(state.searchKeywords.toLowerCase()) !== -1
        );
    });

    function birthdayToSubtitle(person: casesDetailSlim_cases_person) {
        if (person.birthYear && person.birthMonth && person.dayOfBirth) {
            return `Birth: ${person.birthMonth}/${person.dayOfBirth}/${person.birthYear}`;
        } else if (person.birthYear && person.birthMonth) {
            return `Birth: ${person.birthMonth}/${person.birthYear}`;
        } else if (person.birthYear) {
            return `Birth: ${person.birthYear}`;
        } else if (person.birthdayRaw) {
            return `Birth: ${person.birthdayRaw}`;
        } else {
            return '';
        }
    }

    let scroll: ScrollView;

    return props.isLoadingCases ? (
        <Loader />
    ) : props.cases[0] ? (
        <SafeAreaView>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#babab9',
                }}
            >
                <SearchBar
                    inputStyle={{ fontSize: 16 }}
                    inputContainerStyle={{
                        backgroundColor: '#FAFAFA',
                        height: 45.62,
                    }}
                    placeholder="Search Cases"
                    placeholderTextColor="#8D8383"
                    cancelButtonProps={{
                        buttonTextStyle: { color: 'rgb(8,121,169)' },
                    }}
                    // lightTheme
                    round
                    value={state.searchKeywords}
                    onChangeText={handleKeywordChange}
                    // create searchbar target platform.os
                    platform="ios"
                    containerStyle={styles.searchBar}
                />
                <TouchableHighlight
                    onPressIn={() => {
                        setModalVisible(true);
                    }}
                >
                    <View
                        style={{ alignItems: 'center', flexDirection: 'row' }}
                    >
                        <MaterialIcons
                            name="filter-list"
                            color="black"
                            size={32}
                        />
                        <Text style={{ fontSize: 16 }}>Filter</Text>
                    </View>
                </TouchableHighlight>
            </View>

            {/* FILTERS BUTTON - onPress Modal */}
            <Modal
                animationType="fade"
                transparent={false}
                visible={state.modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        height: Platform.OS == 'android' ? 20 : 52,
                    }}
                ></View>

                <TouchableOpacity
                    onPressIn={() => {
                        setModalVisible(!state.modalVisible);
                    }}
                >
                    <Text
                        style={{
                            padding: 10,
                            paddingBottom: Platform.OS == 'android' ? 0 : 30,
                            fontSize: 18,
                            paddingTop: 0,
                            color: '#0F6580',
                            marginTop: Platform.OS === 'android' ? -37 : 0,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Platform.OS === 'android' ? 45 : 20,
                                margin: Platform.OS === 'android' ? -50 : 0,
                            }}
                        >
                            {leftArrow}
                        </Text>
                        <Text> {rtn}</Text>
                    </Text>
                </TouchableOpacity>
                <ScrollView scrollsToTop contentContainerStyle={{}}>
                    <ScrollView
                        scrollsToTop
                        contentContainerStyle={{}}
                    ></ScrollView>
                    <View
                        style={{
                            // marginTop: 10,
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            alignSelf: 'flex-start',
                        }}
                    >
                        {/* SORT BY */}
                        <Text
                            style={{
                                color: 'rgba(24, 23, 21, 0.5)',
                                marginLeft: 10,
                                // marginTop: 20,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: '800',
                                textAlign: 'left',
                            }}
                        >
                            SORT BY
                        </Text>
                        <View
                            style={{
                                borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                                borderBottomWidth: 0.5,
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Full Name"
                                status={
                                    sort === 'Full Name'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Full Name');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: !state.filters.name,
                                            last: false,
                                            DOB: false,
                                            created: false,
                                            updated: false,
                                        },
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Full Name</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Last Name"
                                status={
                                    sort === 'Last Name'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Last Name');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: !state.filters.last,
                                            DOB: false,
                                            created: false,
                                            updated: false,
                                        },
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Last Name</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Date Created"
                                status={
                                    sort === 'Date Created'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Date Created');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: false,
                                            DOB: false,
                                            created: !state.filters.created,
                                            updated: false,
                                        },
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Date Created</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Last Updated"
                                status={
                                    sort === 'Last Updated'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Last Updated');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: false,
                                            DOB: false,
                                            created: false,
                                            updated: !state.filters.updated,
                                        },
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Last Updated</Text>
                        </View>
                        {/* GENDER */}
                        <Text
                            style={{
                                color: 'rgba(24, 23, 21, 0.5)',
                                marginLeft: 10,
                                marginTop: 20,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: '800',
                                textAlign: 'left',
                            }}
                        >
                            GENDER
                        </Text>
                        <View
                            style={{
                                borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                                borderBottomWidth: 0.5,
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                            }}
                            title="Male"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.male}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        male: !state.filters.male,
                                    },
                                })
                            }
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                            }}
                            title="Female"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.female}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        female: !state.filters.female,
                                    },
                                })
                            }
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                                marginBottom: 100,
                            }}
                            title="Not Specified"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.unspecified}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        unspecified: !state.filters.unspecified,
                                    },
                                })
                            }
                        />
                    </View>
                </ScrollView>
                <View
                    style={{
                        alignContent: 'center' as const,
                        alignSelf: 'center' as const,
                        width: 100,
                    }}
                ></View>
            </Modal>

            {/* Case List View Starts Here */}
            <View style={{ paddingBottom: 142 }}>
                <View>
                    {isScrolling ? (
                        <ScrollToTop
                            style={{
                                position: 'absolute',
                                zIndex: 1000,
                                bottom: 10,
                                right: 46,
                            }}
                            onPress={() => {
                                scroll.scrollTo(options);
                            }}
                        />
                    ) : null}
                    <ScrollView
                        ref={(a) => {
                            scroll = a;
                        }}
                        style={{ height: '100%' }}
                        contentInset={{ bottom: constants.headerHeight }}
                        scrollsToTop
                        onScroll={(e) => {
                            if (e.nativeEvent.contentOffset.y <= 250) {
                                setIsScrolling(false);
                            } else if (e.nativeEvent.contentOffset.y >= 250) {
                                setIsScrolling(true);
                            }
                        }}
                        onScrollToTop={() => setIsScrolling(false)}
                        scrollEventThrottle={16}
                    >
                        {props.isLoadingCases ? (
                            <Loader />
                        ) : (
                            SearchedCases.map((result, index) => (
                                <ListItem
                                    key={index}
                                    title={result.person.fullName}
                                    titleStyle={{ color: '#5A6064' }}
                                    subtitle={`${genderAssignment(
                                        result.person.gender
                                    )}\n${birthdayToSubtitle(
                                        result.person
                                    )}`.trim()}
                                    subtitleStyle={{ color: '#9FABB3' }}
                                    leftAvatar={
                                        <View
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 25,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                source={
                                                    result.person.picture
                                                        ? {
                                                              uri:
                                                                  result.person
                                                                      .picture,
                                                          }
                                                        : placeholderImg
                                                }
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 25,
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        </View>
                                    }
                                    topDivider={true}
                                    onPress={() => {
                                        props.navigation.navigate('CaseView', {
                                            pk: result.id,
                                            caseData: result,
                                        });
                                        setIsScrolling(false);
                                    }}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    ) : (
        <ConnectionsLogin
            setUserCreds={props.setUserCreds}
            setModalVisible={props.setModalVisible}
        />
    );
}; // end of FamilyConnectionsScreen

const mapStateToProps = (state: RootState): StateProps => {
    return {
        accessToken: state.auth.accessToken,
        loadingUser: state.auth.loadingUser,
        cases: state.cases.results,
        isLoadingCases: state.cases.isLoadingCases,
        casesError: state.cases.error,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    getCases,
    setUserCreds,
    setModalVisible,
    authChecker,
})(FamilyConnectionsScreen);
