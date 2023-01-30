import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { GraphQLMemberTypesType, GraphQLPostType, GraphQLProfileType, GraphQLUserType } from './query-types';
import { GraphQLID } from 'graphql/type';
import { getMemberTypeById, getPostById, getUserById, createProfile, createUser, createPost } from './helpers';
import { CreateGraphQLProfileInput, CreateGraphQLUserInput, CreateGraphQLPostInput } from './mutation-types';

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
            // getAllTypes: {
            //   type: new GraphQLList(GraphQLAllType),
            //   resolve: () => '',
            // },

            Users: {
              type: new GraphQLList(GraphQLUserType),
              resolve() {
                return fastify.db.users.findMany();
              },
            },

            Profiles: {
              type: new GraphQLList(GraphQLProfileType),
              resolve() {
                return fastify.db.profiles.findMany();
              },
            },

            Posts: {
              type: new GraphQLList(GraphQLPostType),
              resolve() {
                return fastify.db.posts.findMany();
              },
            },

            MemberTypes: {
              type: new GraphQLList(GraphQLMemberTypesType),
              resolve() {
                return fastify.db.memberTypes.findMany();
              },
            },

            UserById: {
              type: new GraphQLList(GraphQLUserType),
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
              },
              resolve(_, { userId }) {
                return getUserById(fastify, userId);
              },
            },

            ProfileById: {
              type: new GraphQLList(GraphQLProfileType),
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
              },
              resolve(_, { profileId }) {
                return getUserById(fastify, profileId);
              },
            },

            PostById: {
              type: new GraphQLList(GraphQLPostType),
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
              },
              resolve(_, { postId }) {
                return getPostById(fastify, postId);
              },
            },

            MemberTypeById: {
              type: new GraphQLList(GraphQLMemberTypesType),
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
              },
              resolve(_, { memberTypeId }) {
                return getMemberTypeById(fastify, memberTypeId);
              },
            },

          }),

        }),
        mutation: new GraphQLObjectType({
          name: "Mutation",
          fields: () => ({
            createUser: {
              type: GraphQLUserType,
              args: { data: { type: CreateGraphQLUserInput } },
              resolve(_, args) {
                const { data } = args;

                return createUser(fastify, data);
              },
            },

            createProfile: {
              type: GraphQLProfileType,
              args: { data: { type: CreateGraphQLProfileInput } },
              resolve(_, args) {
                const { data } = args;

                return createProfile(fastify, data);
              },
            },

            createPost: {
              type: GraphQLPostType,
              args: { data: { type: CreateGraphQLPostInput } },
              resolve(_, args) {
                const { data } = args;

                return createPost(fastify, data);
              },
            },

          }),
        })
      }
      );

      const result: any = await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: request.body.variables,
      });

      console.log(result);


      return result;
    });
};

export default plugin;
