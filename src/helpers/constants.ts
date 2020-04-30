const colors = {
    primary: '#0279AC',
    white: 'white',
    black: 'black',
    gray: 'rgba(24,23,21,.5)',
};

export default {
    devURL: 'https://dev.search.connectourkids.org/api/search-v2',
    prodURL: 'https://search.connectourkids.org/api/search-v2',
    eventTrackingURL: 'https://search.connectourkids.org/api/sendEvent',
    devEventTrackingURL: 'https://dev.search.connectourkids.org/api/sendEvent',
    devFamilyConnectionsInterestURL:
        'https://connect-our-kids.herokuapp.com/api/family_connections_interest',

    primaryColor: colors.primary,
    highlightColor: colors.primary,

    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 0.5,

    backgroundColor: colors.white,

    textColor: colors.black,
    primaryTextColor: colors.primary,
    secondaryTextColor: colors.gray,

    iconColor: colors.primary,
    iconTextColor: colors.white,

    primaryIconColor: colors.primary,
    primaryIconTextColor: colors.white,

    secondaryIconColor: colors.white,
    secondaryIconTextColor: colors.primary,

    buttonColor: colors.primary,
    buttonBorderColor: colors.primary,
    buttonBorderRadius: 4,
    buttonBorderWidth: 0.5,
    buttonBackgroundColor: colors.primary,
    buttonTextColor: colors.white,

    primaryButtonColor: colors.primary,
    primaryButtonBackgroundColor: colors.primary,
    primaryButtonTextColor: colors.white,

    secondaryButtonColor: colors.white,
    secondaryButtonBackgroundColor: colors.white,
    secondaryButtonTextColor: colors.primary,

    inputBorderColor: colors.gray,
    inputBorderRadius: 4,
    inputBorderWidth: 0.5,
    inputBackgroundColor: colors.white,
    inputTextColor: colors.black,
    inputPlaceholderTextColor: colors.gray,

    /* fontFamily: 'futura-light', */
    /* headerFont: 'futura-medium', */

    headerHeight: 85,
    defaultImageUri:
        'https://dev.search.connectourkids.org/api/thumbnail?tokens=AE2861B20B7D6E22D4C9479C5C7387EF9C9CE823D35EABEA7AAFCEB4822D4BE6583BC7DC98D6B5210198C7212B2FD214763272C79F7CA63BE2B8506D2169603090E8B141709B04C80F39BCBFCEC9A282A7BB8F0DB3884DA83EF83FC8D75468D8BDBEB02A142C066F83F3FB82506B407FF8717CEA9C9FE6473138E1E10283F5B34F24AB776656BB6E1313E2142E,AE2861B242686E6ACBCD539D133B8AE59A9AE962DB1FA5AA7AF08DAFDE6D0BF11B678C83D9CDB2322ADF85744B699B543C4E5FE3AC5A925CD38B745A094D5664F48F947358B57DB95E4CE5EB,AE2861B242686E7ECDCD579C5E7398F2969BED6CDD1FA5AA7AF0D1FE8B3458E6423ED4D29392B83E30DC92630078860B351A45E7F10CCF489AD6221B511A0E6AEA99913457E825E95259E5EE91B4BDE2EF92EA61A8F712DE67821AEF8B2C64D1B596E1425E4E38518D98DFA901537D7DF60237AFCCA1CE0D667DB4F445C9',
    recentSearchesMaxSize: 3,
    aboutURI: 'https://www.youtube.com/embed/eMivJgf7RNA',
    familyConnectionsURI: 'https://www.youtube.com/embed/eMivJgf7RNA',
    peopleSearchURI: 'https://www.youtube.com/embed/36OwzSMHHk8',
};
