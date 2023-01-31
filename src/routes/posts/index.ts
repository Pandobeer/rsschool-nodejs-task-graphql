import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();
    return reply.send(JSON.stringify(posts));
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;

      const post = await fastify.db.posts.findOne({ key: "id", equals: postId });

      if (!post) {
        reply.notFound("Post does not exist");
      }

      return reply.send(JSON.stringify(post));
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

      const userId = request.body.userId;

      const user = await fastify.db.users.findOne({ key: "id", equals: userId });

      if (!user) {
        throw reply.badRequest("User does not exist");
      }

      const postToCreate = request.body;

      const createdPost = await fastify.db.posts.create(postToCreate);

      return reply.send(JSON.stringify(createdPost));
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;

      const postToDel = await fastify.db.posts.findOne({ key: "id", equals: postId });

      if (!postToDel) {
        throw reply.badRequest("Post does not exist");
      }
      await fastify.db.posts.delete(postId);

      return reply.send();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;

      const postToUpdate = await fastify.db.posts.findOne({ key: "id", equals: postId });

      if (!postToUpdate) {
        throw reply.badRequest("Post does not exist");
      }

      const dataToUpdate = request.body;

      const updatedPost = { ...postToUpdate, ...dataToUpdate };

      await fastify.db.posts.change(postId, updatedPost);

      return reply.send(JSON.stringify(updatedPost));
    }
  );
};

export default plugin;
