import {LessThan} from 'typeorm';

import {AppDataSource} from '../data-source';
import {HttpError} from '../utils/HttpError';
import {GetUserPostsArgs, NewPost, UpdatePost} from '../schemas/post.schema';
import {PostEntity} from '../entities/post.entity';
import userService from './user.service';

export const postRepository = AppDataSource.getRepository(PostEntity);

const createPost = async ({owner: ownerId, ...postData}: NewPost) => {
    const newPost = postRepository.create(postData);
    const owner = await userService.findUser(ownerId)
    newPost.owner = {
        id: owner.id,
        profile: {
            id: owner.profile.id,
            firstName: owner.profile.firstName,
            lastName: owner.profile.lastName,
            profileImage: owner.profile.profileImage
        }
    } as any;

    newPost.comments = [];
    const post = await postRepository.save(newPost);

    return post;
};

export const ownerFields = {
    id: true,
    userName: true,
    profile: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
    },
};

const getFeeds = async (before: Date, limit: number) => {
    const posts = await postRepository.find({
        relations: ['owner', 'owner.profile', 'likes', 'likes.profile'],
        select: {
            owner: ownerFields,
            likes: ownerFields,
        },
        where: {updatedAt: LessThan(before)},
        loadRelationIds: {
            relations: ['savedBy'],
        },
        take: limit,
        order: {
            updatedAt: 'DESC',
        },
    });

    const first = await getFirstPost();
    const hasNext =
        posts.length === 0 ? false : posts[posts.length - 1].id !== first.id;
    const next = hasNext ? posts[posts.length - 1].updatedAt : '';

    return {posts, next, hasNext};
};

const getFirstPost = async () => {
    const [first] = await postRepository.find({
        order: {
            updatedAt: 'ASC',
        },
        take: 1,
    });

    return first;
};

const getUserPosts = async ({
                                offset = 0,
                                limit = 10,
                                group,
                                userId,
                            }: GetUserPostsArgs) => {
    const relations = {
        saved: 'savedPosts',
        liked: 'favoritePosts',
        owned: 'posts',
    };

    const postsIds = await userService.getUserPostsIds(userId, relations[group]);

    const qb = postRepository
        .createQueryBuilder('post')
        .leftJoin('post.likes', 'likedBy')
        .leftJoin('likedBy.profile', 'likedByProfile')
        .leftJoin('post.owner', 'owner')
        .leftJoin('owner.profile', 'profile')
        .where('post.id IN (:...ids)', {
            ids: postsIds,
        })
        .addSelect([
            'likedBy.id',
            'likedByProfile.profileImage',
            'likedBy.userName',
            'likedByProfile.firstName',
            'likedByProfile.lastName',
            'owner.id',
            'owner.userName',
            'profile.profileImage',
            'profile.firstName',
            'profile.lastName',
        ])

        .orderBy('post.updatedAt', 'DESC')
        .skip(offset)
        .take(limit);

    if (group !== 'saved') qb.loadAllRelationIds({relations: ['savedBy']});

    const [posts, count] = await qb.getManyAndCount();
    const hasNext = count > posts.length + offset;
    const next = hasNext ? offset + limit : '';

    return {posts, next, hasNext};
};

const updatePost = async ({content, images, id}: UpdatePost) => {
    const post = await findPost(id);
    post.images = images;
    post.content = content;
    await postRepository.save(post);
    return post;
};

const likePost = async (userId: string, postId: string) => {
    const user = await userService.findUser(userId);

    const post = await findPost(postId);

    if (post?.likes.some((u) => u.id === userId)) {
        post.likes = post.likes.filter((u) => u.id !== userId);
    } else {
        post?.likes.push(user);
    }
    await postRepository.save(post);

    return post;
};

const savePost = async (postId: string, userId: string) => {
    const post = await findPost(postId);

    if (post.savedBy.some((u) => u.id === userId)) {
        post.savedBy = post.savedBy.filter((u) => u.id !== userId);
    } else {
        post.savedBy.push({id: userId} as any);
    }

    await postRepository.save(post);

    return post;
};

const deletePost = async (postId: string) => {
    const post = await findPost(postId);

    await postRepository.delete(post.id);
};

const findPost = async (id: string) => {
    const post = await postRepository.findOne({
        where: {id},
        relations: ['owner', 'owner.profile', 'likes', 'likes.profile', 'savedBy'],
        select: {
            owner: ownerFields,
            likes: ownerFields,
            savedBy: {
                id: true,
            },
        },
    });

    if (!post) throw new HttpError(401, 'Post not found');
    return post;
};

export default {
    createPost,
    getFeeds,
    getUserPosts,
    savePost,
    likePost,
    findPost,
    updatePost,
    deletePost,
};
