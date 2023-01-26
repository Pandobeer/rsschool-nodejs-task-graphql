import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (_request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany();
    return reply.send(JSON.stringify(users));
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;

      const user = await fastify.db.users.findOne({ key: "id", equals: userId });

      if (!user) {
        reply.notFound("User does not exist");
      }

      return reply.send(JSON.stringify(user));
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userToCreate = request.body;
      const createdUser = await fastify.db.users.create(userToCreate);
      return reply.send(JSON.stringify(createdUser));
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      // const userId = request.params.id;

      // const userToDelete = await fastify.db.users.findOne({ key: "id", equals: userId });


      // if (!userToDelete) {
      //   throw reply.badRequest("User does not exist");
      // }
      return reply.send();
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;
      const idFromBody = request.body.userId;

      const userToSubscribe = await fastify.db.users.findOne({ key: "id", equals: idFromBody });


      if (!userToSubscribe) {
        throw reply.badRequest("User does not exist");
      }

      const subscribedToUserIds = userToSubscribe.subscribedToUserIds;
      subscribedToUserIds.push(userId);

      const updatedUserToSubscribe = { ...userToSubscribe, subscribedToUserIds };

      await fastify.db.users.change(idFromBody, updatedUserToSubscribe);

      return reply.send(JSON.stringify(updatedUserToSubscribe));

    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      const userId = request.params.id;

      const idToUnscubscribeFrom = request.body.userId;

      const userToUnsubscribeFrom = await fastify.db.users.findOne({ key: "id", equals: idToUnscubscribeFrom });

      if (!userToUnsubscribeFrom || !userId) {
        throw reply.badRequest("User does not exist");
      }

      const unsubscribedToUserIds = userToUnsubscribeFrom.subscribedToUserIds;
      const indexOfUserIdToUnsubscribe = unsubscribedToUserIds.indexOf(userId);

      if (indexOfUserIdToUnsubscribe < 0) {
        throw reply.badRequest("User does not exist");
      }

      unsubscribedToUserIds.splice(indexOfUserIdToUnsubscribe, 1);

      const updatedUserToUnsubscribeFrom = { ...userToUnsubscribeFrom, unsubscribedToUserIds };

      await fastify.db.users.change(idToUnscubscribeFrom, updatedUserToUnsubscribeFrom);

      return reply.send(JSON.stringify(updatedUserToUnsubscribeFrom));
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;

      const user = await fastify.db.users.findOne({ key: "id", equals: userId });

      if (!user) {
        throw reply.badRequest("User does not exist");
      }

      const dataToChange = request.body;

      const updatedUser = { ...user, ...dataToChange };

      await fastify.db.users.change(userId, updatedUser);

      return reply.send(JSON.stringify(updatedUser));

    }
  );
};

export default plugin;
