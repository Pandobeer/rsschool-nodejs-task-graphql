import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { GraphQLID, GraphQLInt } from 'graphql/type';
import { graphqlBodySchema } from './schema';

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
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
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

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: "Query",
          fields: () => ({
            getUsers: {
              type: new GraphQLList(GraphQLUserType),
              resolve() {
                return fastify.db.users.findMany();
              },
            },

            getProfiles: {
              type: new GraphQLList(GraphQLProfileType),
              resolve() {
                return fastify.db.profiles.findMany();
              },
            },

            getPosts: {
              type: new GraphQLList(GraphQLPostType),
              resolve() {
                return fastify.db.posts.findMany();
              },
            },

            getMemberTypes: {
              type: new GraphQLList(GraphQLMemberTypesType),
              resolve() {
                return fastify.db.memberTypes.findMany();
              },
            },

          }),
        }),
      }
      );

      const result = await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
      });

      console.log(result);


      return reply.send(result);
    });
};

export default plugin;
