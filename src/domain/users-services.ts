import {
  CredentialType,
  LoginType,
  SearchResultType,
  UserInputType,
  UserType,
  UserWithHashedPasswordType
} from "../db/types";
import {usersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {authService} from "./auth-services";

export const usersService = {

  async getAllUsers(userInput: UserInputType): Promise<SearchResultType<UserType>> {

    if (!userInput.pageNumber) userInput.pageNumber = 1;
    if (!userInput.pageSize) userInput.pageSize = 10;

    const {usersSearchResult, usersCount} = await usersRepository.findAll(userInput);

    const result: SearchResultType<UserType> = {
      pagesCount: Math.ceil(usersCount / userInput.pageSize),
      page: userInput.pageNumber,
      pageSize: userInput.pageSize,
      totalCount: usersCount,
      items: usersSearchResult
    }

    return result;
  },

  async findById(id: string): Promise<UserType | null> {
    return await usersRepository.findById(id)
  },

  async findByLogin(login: string): Promise<UserWithHashedPasswordType | null> {
    return await usersRepository.findByLogin(login);
  },

  async create(credentials: CredentialType): Promise<UserType> {
    const passwordHash = await authService.generateHash(credentials.password);
    const user = {
      id: uuidv4(),
      login: credentials.login,
      email: credentials.email,
      passwordHash,
      createdAt: new Date()
    }
    return usersRepository.create(user)
  },

  async delete(id: string): Promise<boolean> {
    return await usersRepository.delete(id);
  },
  async findByLoginAndEmail(login: string, email: string): Promise<UserWithHashedPasswordType | null> {
    return usersRepository.findByLoginAndEmail(login, email);
  },
  findByEmail(email: string): Promise<UserType | null> {
    return usersRepository.findByEmail(email);
  }
}