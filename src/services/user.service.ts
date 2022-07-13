import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/user.entity';
import { Credentials, NewUser } from '../schemas/user.schema';
import { server } from '../config';
import { HttpError } from '../utils/HttpError';
import utils from '../utils/functions';

const userRepository = AppDataSource.getRepository(UserEntity);

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

const generateToken = (id: string, duration = '21d'): string => {
  return sign({ id }, server.JWT_SECRET, {
    expiresIn: duration,
  });
};

const generateVerificationUrl = (id: string) => {
  const token = generateToken(id, '2d');
  return `${server.CLIENT_URL}/${token}`;
};

export default { createUser, login, generateToken, generateVerificationUrl };
