import { hash, compare } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { HttpError } from '../utils/HttpError';
import { UserEntity } from '../entities/user.entity';
import { Credentials, NewUser, ResetPayload } from '../schemas/user.schema';
import { serverConfig } from '../config';
import utils from '../utils/functions';

export const userRepository = AppDataSource.getRepository(UserEntity);

const createUser = async (
  newUserData: NewUser
): Promise<Omit<UserEntity, 'password'>> => {
  const { password, ...data } = newUserData;

  const hashedPassword = await hash(password, 12);
  const userName = newUserData.firstName + utils.genRandom(6);
  const newUser = await userRepository.save({
    ...data,
    userName,
    password: hashedPassword,
  });
  const { password: pass, ...user } = newUser;
  return user;
};

const login = async ({
  email,
  password,
}: Credentials): Promise<Omit<UserEntity, 'password'>> => {
  const user = await userRepository.findOne({ where: { email } });
  if (!user) throw new HttpError(401, 'Invalid Email, please try again.');

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid)
    throw new HttpError(401, 'Invalid Password, please try again. ');

  const { password: pass, ...rest } = user;

  return rest;
};

const generateToken = (
  id: string,
  duration: string | number = '21d'
): string => {
  return sign({ id }, serverConfig.JWT_SECRET, {
    expiresIn: duration,
  });
};

const generateVerificationUrl = (id: string) => {
  const token = generateToken(id, '2d');
  return `${serverConfig.CLIENT_URL}/${token}`;
};

const generateResetUrl = async (email: string) => {
  const user = await userRepository.findOneBy({
    email: email as string,
  });

  if (!user)
    throw new HttpError(401, 'Invalid Email, please try again later. ');

  const resetToken = generateToken(user.id, 60 * 30);
  const url = `${serverConfig.CLIENT_URL}/reset-password/${resetToken}`;

  return url;
};

const updatePassword = async ({ token, newPassword }: ResetPayload) => {
  const { id } = verify(token, serverConfig.JWT_SECRET) as JwtPayload;

  const user = await userRepository.findOneBy({ id });
  if (!user) throw new HttpError(401, 'User not found');

  user.password = await hash(newPassword, 12);
  const { password, ...savedUser } = await userRepository.save(user);
  return savedUser;
};

const findUser = async (id: string) => {
  const user = await userRepository.findOneBy({ id });

  if (!user) throw new HttpError(401, 'User not found');
  return user;
};

export default {
  createUser,
  login,
  generateToken,
  generateVerificationUrl,
  generateResetUrl,
  updatePassword,
  findUser,
};
