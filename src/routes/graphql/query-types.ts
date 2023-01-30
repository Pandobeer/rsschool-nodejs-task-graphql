import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLID, GraphQLInt } from 'graphql/type';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { getMemberTypeById, getPostById, getProfileById, getUserSubscribedTo, getSubscribedToUser } from './helpers';

export const GraphQLUserType: GraphQLObjectType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
        posts: {
            type: new GraphQLList(GraphQLPostType),
            resolve: async (userData: UserEntity, _, fastify: FastifyInstance) => getPostById(fastify, userData.id),
        },
        profile: {
            type: GraphQLProfileType,
            resolve: async (profileData: UserEntity, _, fastify: FastifyInstance) => getProfileById(fastify, profileData.id),
        },
        memberType: {
            type: GraphQLMemberTypesType,
            resolve: async (memberTypeData: UserEntity, _, fastify: FastifyInstance) => getMemberTypeById(fastify, memberTypeData.id),
        },
        userSubscribedTo: {
            type: new GraphQLList(GraphQLUserType),
            resolve: async (userSubscribedToData: UserEntity, _, fastify: FastifyInstance) => {
                return await getUserSubscribedTo(fastify, userSubscribedToData.id);
            }
        },
        subscribedToUser: {
            type: new GraphQLList(GraphQLUserType),
            resolve: async (subscribedToUserData: UserEntity, _, fastify: FastifyInstance) => {
                return await getSubscribedToUser(fastify, subscribedToUserData.subscribedToUserIds);
            }
        }
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
