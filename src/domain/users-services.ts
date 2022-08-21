import {
  CredentialType,
  LoginType,
  PaginatorParamsType,
  SearchResultType,
  TOKEN_STATUS,
  TokenType,
  UserFullType,
  UserInputType,
  UserShortType,
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

  async create(userCredentials: CredentialType, status: TOKEN_STATUS = TOKEN_STATUS.NONE): Promise<UserFullType> {
    const passwordHash = await authService.generateHash(userCredentials.password);

    const credentials: CredentialType = {
      login: userCredentials.login,
      email: userCredentials.email,
      password: passwordHash,
    };

    const token: TokenType = {
      confirmationToken: uuidv4(),
      tokenStatus: status,
      tokenJWT: ''
    }
    const user: UserFullType = {
      id: uuidv4(),
      credentials,
      token,
      createdAt: new Date()
    }
    return  await usersRepository.create(user);
  },
  async findByLogin(login: string): Promise<UserFullType | null> {
    return await usersRepository.findByLogin(login)
  },
  async findByEmail(email: string): Promise<UserFullType | null> {
    return await usersRepository.findByEmail(email)
  },

  async findByLoginPass(shortCredentials: LoginType): Promise<UserFullType | null> {
    const userByLogin = await this.findByLogin(shortCredentials.login);
    if(userByLogin){
      const isPassCorrect = await authService.isPasswordCorrect(shortCredentials.password, userByLogin.credentials.password);
      if(isPassCorrect){
        return userByLogin
      }
    }
    return null;
  },
  async findByLoginEmailPass(credentials: CredentialType): Promise<UserFullType | null> {
    const {login, email, password} = credentials
    const user = await usersRepository.findByLoginEmail(login, email);
    if(user) {
      const isPassCorrect = await authService.isPasswordCorrect(password, user.credentials.password);
      if(isPassCorrect){
        return user
      }
    }
    return null;
  },
  async delete(id: string): Promise<boolean> {
    return await usersRepository.delete(id);
  },
  async setTokenStatus(id: string, status: TOKEN_STATUS): Promise<boolean> {
    return await usersRepository.setTokenStatus(id, status)
  }
}