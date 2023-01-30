import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLID, GraphQLInt } from 'graphql/type';

export const GraphQLUserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    }),
});

export const GraphQLPostType = new GraphQLObjectType({
    name: "PostType",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLString },
    }),
});

export const GraphQLProfileType = new GraphQLObjectType({
    name: "ProfileType",
    fields: () => ({
        id: { type: GraphQLID },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
        userId: { type: GraphQLString },
    }),
});

export const GraphQLMemberTypesType = new GraphQLObjectType({
    name: "MemberType",
    fields: () => ({
        id: { type: GraphQLID },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    }),
});
