import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    const profiles = await fastify.db.profiles.findMany();
    return reply.send(JSON.stringify(profiles));
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;

      const profile = await fastify.db.profiles.findOne({ key: "id", equals: profileId });

      if (!profile) {
        reply.notFound("Profile of user does not exist");
      }

      return reply.send(JSON.stringify(profile));
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const userId = request.body.userId;

      const user = await fastify.db.users.findOne({ key: "id", equals: userId });

      if (!user) {
        throw reply.badRequest("User does not exist");
      }

      const memberTypeId = request.body.memberTypeId;

      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

      if (!memberType) {
        throw reply.badRequest("Member Type does not exist");
      }

      const profile = await fastify.db.profiles.findOne({ key: "userId", equals: userId });

      if (profile) {
        throw reply.badRequest("User profile already exists");
      }

      const createdProfile = await fastify.db.profiles.create(request.body);

      return reply.send(JSON.stringify(createdProfile));
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;

      const profileToDel = await fastify.db.profiles.findOne({ key: "id", equals: profileId });

      if (!profileToDel) {
        throw reply.badRequest("Profile does not exist");
      }
      await fastify.db.profiles.delete(profileId);


      return reply.send(JSON.stringify(profileToDel));
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;

      const profileToUpdate = await fastify.db.profiles.findOne({ key: "id", equals: profileId });

      if (!profileToUpdate) {
        throw reply.badRequest("Profile does not exist");
      }

      const dataToUpdate = request.body;

      const updatedProfile = { ...profileToUpdate, ...dataToUpdate };

      await fastify.db.profiles.change(profileId, updatedProfile);

      return reply.send(JSON.stringify(updatedProfile));
    }
  );
};

export default plugin;
