import gql from 'graphql-tag';

export const USER_FULL_FRAGMENT = gql`
    fragment CaseRoleFragment on CaseRole {
        caseId
        role
    }

    fragment TeamFragment on Team {
        id
        name
        picture
        email
    }

    fragment UserFullFragment on User {
        id
        sub
        email
        firstName
        lastName
        picture
        isSiteAdmin
        userTeam {
            team {
                ...TeamFragment
            }
            role
        }
        caseRoles {
            ...CaseRoleFragment
        }
    }
`;

export const ME_QUERY = gql`
    query meQuery {
        me {
            ...UserFullFragment
        }
    }

    ${USER_FULL_FRAGMENT}
`;
