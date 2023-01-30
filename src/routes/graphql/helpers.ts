import { FastifyInstance } from "fastify";
import { CreatePostDTO } from "../../utils/DB/entities/DBPosts";
import { CreateProfileDTO } from "../../utils/DB/entities/DBProfiles";
import { CreateUserDTO } from "../../utils/DB/entities/DBUsers";

export const getUserById = async (
    fastify: FastifyInstance,
    useriId: string
) => {
    const user = await fastify.db.users.findOne({ key: "id", equals: useriId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    return user;
};

export const getProfileById = async (
    fastify: FastifyInstance,
    profileId: string
) => {
    const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: profileId,
    });

    if (!profile) {
        throw fastify.httpErrors.notFound("Profile does not exist");
    }

    return profile;
};

export const getPostById = async (fastify: FastifyInstance, postId: string) => {
    console.log(postId);

    const posts = await fastify.db.posts.findMany({
        key: "userId",
        equals: postId,
    });

    if (!posts) {
        throw fastify.httpErrors.notFound("Post does not exist");
    }

    return posts;
};

export const getMemberTypeById = async (
    fastify: FastifyInstance,
    userId: string
) => {
    const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: userId,
    });

    if (!profile) {
        throw fastify.httpErrors.notFound("Profile does not exist");
    }

    const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: profile.memberTypeId,
    });

    if (!memberType) {
        throw fastify.httpErrors.notFound("Member Type does not exist");
    }

    return memberType;
};

export const createUser = async (
    fastify: FastifyInstance,
    user: CreateUserDTO
): Promise<CreateUserDTO> => {
    const createdUser = await fastify.db.users.create(user);
    return createdUser;
};

export const createProfile = async (
    fastify: FastifyInstance,
    profileToCreate: CreateProfileDTO
): Promise<CreateProfileDTO> => {
    const userId = profileToCreate.userId;

    const user = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    const memberTypeId = profileToCreate.memberTypeId;

    const userMemberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: memberTypeId,
    });

    if (!userMemberType) {
        throw fastify.httpErrors.badRequest("Member Type does not exist");
    }

    const userProfile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: userId,
    });

    if (userProfile) {
        throw fastify.httpErrors.badRequest("User profile already exists");
    }

    const createdProfile = await fastify.db.profiles.create(profileToCreate);

    return createdProfile;
};

export const createPost = async (
    fastify: FastifyInstance,
    post: CreatePostDTO
): Promise<CreatePostDTO> => {
    const userId = post.userId;

    const user = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    const createdPost = await fastify.db.posts.create(post);

    return createdPost;
};

export const getUserSubscribedTo = async (
    fastify: FastifyInstance,
    subscribedId: string
) => {
    const userSubs = await fastify.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: subscribedId,
    });

    return userSubs;
};

export const getSubscribedToUser = async (
    fastify: FastifyInstance,
    subscribedToUserIds: string[]
) => {
    const subscribedToUser = await Promise.all(
        subscribedToUserIds.map(async (userId) =>
            await fastify.db.users.findOne({ key: "id", equals: userId })
        )
    );
    console.log(subscribedToUser);

    return subscribedToUser;
};

export const subscribeUser = async (fastify: FastifyInstance, id: string, userId: string) => {
    const userToSubscribe = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!userToSubscribe) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    const subscribedToUserIds = userToSubscribe.subscribedToUserIds;
    subscribedToUserIds.push(id);

    const updatedUserToSubscribe = { ...userToSubscribe, subscribedToUserIds };

    const updatedUser = await fastify.db.users.change(userId, updatedUserToSubscribe);

    return updatedUser;
};

export const unsubscribeUser = async (fastify: FastifyInstance, id: string, userId: string) => {
    const userToUnsubscribeFrom = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!userToUnsubscribeFrom) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    if (!userToUnsubscribeFrom.subscribedToUserIds.includes(id)) {
        throw fastify.httpErrors.badRequest("User does not exist");
    }

    const subscribedToUserIds = userToUnsubscribeFrom.subscribedToUserIds.filter((subscribedId) => subscribedId !== id);

    const updatedUser = await fastify.db.users.change(userId, { subscribedToUserIds });

    return updatedUser;
};
