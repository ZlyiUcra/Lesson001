import {
  CredentialType, LoginType, PaginatorParamsType,
  SearchResultType,
  TOKEN_STATUS,
  TokenType,
  UserFullType,
  UserInputType, UserShortType,
} from "../db/types";
import {usersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {authService} from "./auth-services";

export const usersService = {

  async getAll(userInput: UserInputType): Promise<SearchResultType<UserShortType>> {

    let {pageNumber, pageSize} = userInput;

    const paginator: PaginatorParamsType = {
      skip: pageSize * (pageNumber - 1),
      limit: pageSize
    };

    const {usersSearch, usersCount} = await usersRepository.findAll(paginator);

    const usersSearchResult: UserShortType[] = usersSearch.map((user: UserFullType): UserShortType => {
      return {id: user.id, login: user.credentials.login}
    });

    const result: SearchResultType<UserShortType> = {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: usersSearchResult
    };

    return result;
  },

  async findById(id: string): Promise<UserFullType | null> {
    return await usersRepository.findById(id)
  },

  async create(userCredentials: CredentialType): Promise<UserShortType> {
    const passwordHash = await authService.generateHash(userCredentials.password);

    const credentials: CredentialType = {
      login: userCredentials.login,
      email: userCredentials.email,
      password: passwordHash,
    };

    const token: TokenType = {
      confirmationToken: uuidv4(),
      tokenStatus: TOKEN_STATUS.SENT,
      tokenJWT: ''
    }
    const user: UserFullType = {
      id: uuidv4(),
      credentials,
      token,
      createdAt: new Date()
    }
    const userFromDB = await usersRepository.create(user);

    return {id: userFromDB.id, login: userFromDB.credentials.login}
  },
  async findByLogin(login: string): Promise<UserFullType | null> {
    return await usersRepository.findByLogin(login)
  },
  async findByEmail(email: string): Promise<UserFullType | null> {
    return await usersRepository.findByEmail(email)
  },
  async findByLoginEmail(credentials: LoginType): Promise<UserFullType | null> {
    const passwordHash = await authService.generateHash(credentials.password);
    return usersRepository.findByLoginEmail({login: credentials.login, password: passwordHash});
  },
  async delete(id: string): Promise<boolean> {
    return await usersRepository.delete(id);
  }
}