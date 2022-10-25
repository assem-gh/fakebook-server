import {compare, hash} from 'bcrypt';
import {JwtPayload, sign, verify} from 'jsonwebtoken';

import {AppDataSource} from '../data-source';
import {HttpError} from '../utils/HttpError';
import {UserEntity} from '../entities/user.entity';
import {Credentials, NewUser, ResetPayload} from '../schemas/user.schema';
import {serverConfig} from '../config';
import utils from '../utils/functions';
import {ownerFields} from './post.service';
import {ProfileEntity} from '../entities/profile.entity';

export const userRepository = AppDataSource.getRepository(UserEntity);
const profileRepository = AppDataSource.getRepository(ProfileEntity);

interface UserShort {
    id: string;
    userName: string;
    email: string;
    profile: {
        id: string;
        firstName: string;
        lastName: string;
        profileImage: string;
    };
}

const createUser = async (newUserData: NewUser): Promise<UserShort> => {
    const {password, firstName, lastName, email, birthday, gender} =
        newUserData;

    const profile = profileRepository.create({
        firstName,
        lastName,
        birthday,
        gender,
    });

    await profileRepository.save(profile);

    const hashedPassword = await hash(password, 12);
    const userName = newUserData.firstName + utils.genRandom(6);
    const newUser = userRepository.create({
        email,
        userName,
        password: hashedPassword,
        savedPosts: [],
        profile,
    });

    await userRepository.save(newUser);

    return {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
        profile: {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
        },
    };
};

const login = async ({email, password}: Credentials) => {
    const user = await userRepository.findOne({
        where: {email},
        relations: ['profile', 'savedPosts'],
        loadRelationIds: {
            relations: ['savedPosts'],
        },

        select: {...ownerFields, email: true, password: true},
    });
    if (!user) throw new HttpError(401, 'Invalid Email, please try again.');

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
        throw new HttpError(401, 'Invalid Password, please try again. ');

    const {password: pass, savedPosts, ...rest} = user;

    return {
        user: rest,
        savedPostsIds: savedPosts,
    };
};

const generateToken = (
    id: string,
    duration: string | number = '21d'
): string => {
    return sign({id}, serverConfig.JWT_SECRET, {
        expiresIn: duration,
    });
};

const generateVerificationUrl = (id: string) => {
    const token = generateToken(id, '2d');
    return `${serverConfig.CLIENT_URL}/${token}`;
};

const generateResetUrl = async (email: string) => {
    const user = await userRepository.findOneBy({
        email: email,
    });

    if (!user)
        throw new HttpError(401, 'Invalid Email, please try again later. ');

    const resetToken = generateToken(user.id, 60 * 30);
    const url = `${serverConfig.CLIENT_URL}/reset-password/${resetToken}`;

    return url;
};

const updatePassword = async ({token, newPassword}: ResetPayload) => {
    const {id} = verify(token, serverConfig.JWT_SECRET) as JwtPayload;

    const user = await userRepository.findOneBy({id});
    if (!user) throw new HttpError(401, 'User not found');

    user.password = await hash(newPassword, 12);
    const {password, ...savedUser} = await userRepository.save(user);
    return savedUser;
};

const findUser = async (id: string) => {
    const user = await userRepository.findOne({
        where: {id},
        relations: ['profile', 'savedPosts'],
        loadRelationIds: {
            relations: ['savedPosts'],
        },
        // select: { profile: true, email: true, password: true },
    });

    if (!user) throw new HttpError(401, 'User not found');
    return user;
};

const getUserPostsIds = async (
    userId: string,
    relationName: 'favoritePosts' | 'savedPosts' | 'posts'
) => {
    const user = await userRepository.findOne({
        where: {id: userId},
        relations: {[relationName]: true},
        loadRelationIds: {
            [relationName]: true,
        },
    });

    return user ? user[relationName] : [];
};

const getUserPosts = async (
    userId: string,
    group: 'saved' | 'liked' | 'owned'
) => {
    const relationName = {
        saved: 'savedPosts',
        liked: 'favoritePosts',
        owned: 'posts',
    };

    const relations = [
        `${relationName[group]}`,
        `${relationName[group]}.owner`,
        `${relationName[group]}.likes`,
    ];

    const user = await userRepository.find({
        where: {id: userId},
        relations,
        select: {
            [relationName[group]]: {
                id: true,
                likes: ownerFields,
                owner: ownerFields,
                content: true,
                images: true,
                createdAt: true,
                updatedAt: true,
            },
        },
    });

    return user ? user[relationName[group]] : [];
};

const updateProfile = async (
    newData: Partial<ProfileEntity>,
    profileId: string,
    email?: string | undefined
) => {
    let profile = await profileRepository.findOne({
        where: {id: profileId}, relations: {user: true}, select: {
            user: {
                password: false,
                email: true,
                userName: true,
                id: true

            }
        }
    });
    if (!profile) throw new HttpError(401, 'User not found');

    if (email) {
        profile.user.email = email;
    }

    profile = {...profile, ...newData};
    await profileRepository.save(profile);
    return profile;
};

export default {
    createUser,
    login,
    generateToken,
    generateVerificationUrl,
    generateResetUrl,
    updatePassword,
    findUser,
    getUserPosts,
    getUserPostsIds,
    updateProfile,
};
