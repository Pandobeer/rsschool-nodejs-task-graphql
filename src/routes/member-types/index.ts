import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const memberTypes = await fastify.db.memberTypes.findMany();
    return reply.send(JSON.stringify(memberTypes));
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = request.params.id;

      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

      if (!memberType) {
        reply.notFound("Member type does not found");
      }

      return reply.send(JSON.stringify(memberType));
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = request.params.id;

      const memberTypeToUpdate = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

      if (!memberTypeToUpdate) {
        throw reply.badRequest("Member type does not exist");
      }

      const dataToUpdate = request.body;

      const updatedMemberType = { ...memberTypeToUpdate, ...dataToUpdate };

      await fastify.db.memberTypes.change(memberTypeId, updatedMemberType);

      return reply.send(JSON.stringify(updatedMemberType));
    }
  );
};

export default plugin;
