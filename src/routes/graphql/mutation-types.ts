import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLInt } from 'graphql/type';

export const CreateGraphQLUserInput = new GraphQLInputObjectType({
    name: "CreateGraphQLUserInput",
    fields: () => ({
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const CreateGraphQLProfileInput = new GraphQLInputObjectType({
    name: "CreateGraphQLProfileInput",
    fields: () => ({
        avatar: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLInt) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const CreateGraphQLPostInput = new GraphQLInputObjectType({
    name: "CreateGraphQLPostInput",
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});