import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/user.entity';
import { NewUser } from '../schemas/user.schema';
import { server } from '../config';
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

const generateToken = (id: string, duration = '21d'): string => {
  return sign({ id }, server.JWT_SECRET, {
    expiresIn: duration,
  });
};

const generateVerificationUrl = (id: string) => {
  const token = generateToken(id, '30m');
  return `${server.CLIENT_URL}/${token}`;
};

export default { createUser, generateToken, generateVerificationUrl };
