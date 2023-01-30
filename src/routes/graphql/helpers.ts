import { FastifyInstance } from "fastify";
import { CreatePostDTO } from "../../utils/DB/entities/DBPosts";
import { CreateProfileDTO } from "../../utils/DB/entities/DBProfiles";
import { CreateUserDTO } from "../../utils/DB/entities/DBUsers";

export const getUserById = async (fastify: FastifyInstance, useriId: string) => {
    const user = await fastify.db.users.findOne({ key: "id", equals: useriId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    return user;
};

export const getProfileById = async (fastify: FastifyInstance, profileId: string) => {
    const profile = await fastify.db.profiles.findOne({ key: "id", equals: profileId });

    if (!profile) {
        throw fastify.httpErrors.notFound("Profile does not exist");
    }

    return profile;
};

export const getPostById = async (fastify: FastifyInstance, postId: string) => {
    const post = await fastify.db.posts.findOne({ key: "id", equals: postId });

    if (!post) {
        throw fastify.httpErrors.notFound("Post does not exist");
    }

    return post;
};


export const getMemberTypeById = async (fastify: FastifyInstance, memberTypeId: string) => {
    const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

    if (!memberType) {
        throw fastify.httpErrors.notFound("Member Type does not exist");
    }

    return memberType;
};

export const createUser = async (fastify: FastifyInstance, user: CreateUserDTO): Promise<CreateUserDTO> => {
    const createdUser = await fastify.db.users.create(user);
    return createdUser;
};

export const createProfile = async (fastify: FastifyInstance, profileToCreate: CreateProfileDTO): Promise<CreateProfileDTO> => {
    const userId = profileToCreate.userId;

    const user = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    const memberTypeId = profileToCreate.memberTypeId;

    const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

    if (!memberType) {
        throw fastify.httpErrors.badRequest("Member Type does not exist");
    }

    const profile = await fastify.db.profiles.findOne({ key: "userId", equals: userId });

    if (profile) {
        throw fastify.httpErrors.badRequest("User profile already exists");
    }

    const createdProfile = await fastify.db.profiles.create(profileToCreate);

    return createdProfile;
};

export const createPost = async (fastify: FastifyInstance, post: CreatePostDTO): Promise<CreatePostDTO> => {
    const userId = post.userId;

    const user = await fastify.db.users.findOne({ key: "id", equals: userId });

    if (!user) {
        throw fastify.httpErrors.notFound("User does not exist");
    }

    const createdPost = await fastify.db.posts.create(post);

    return createdPost;
};




