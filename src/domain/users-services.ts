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
import {UsersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {AuthService} from "./auth-services";

export class UsersServices {
  usersRepository: UsersRepository;
  authService: AuthService;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.authService = new AuthService();
  }

  async getAll(userInput: UserInputType): Promise<SearchResultType<UserShortType>> {

    let {pageNumber, pageSize} = userInput;

    const paginator = new PaginatorParamsType(pageSize * (pageNumber - 1), pageSize);

    const {usersSearch, usersCount} = await this.usersRepository.findAll(paginator);

    const usersSearchResult: UserShortType[] = usersSearch.map((user: UserFullType): UserShortType => {
      return {id: user.id, login: user.credentials.login}
    });

    const result = new SearchResultType<UserShortType>(
      Math.ceil(usersCount / pageSize),
      pageNumber,
      pageSize,
      usersCount,
      usersSearchResult
    );

    return result;
  }

  async findById(id: string): Promise<UserFullType | null> {
    return await this.usersRepository.findById(id)
  }

  async create(userCredentials: CredentialType, status: TOKEN_STATUS = TOKEN_STATUS.NONE): Promise<UserFullType> {
    const passwordHash = await this.authService.generateHash(userCredentials.password);

    const credentials = new CredentialType(userCredentials.login, userCredentials.email, passwordHash);

    const token = new TokenType(uuidv4(), status, '')
    const user = new UserFullType(uuidv4(), credentials, token, new Date())

    return await this.usersRepository.create(user);
  }

  async findByLogin(login: string): Promise<UserFullType | null> {
    return await this.usersRepository.findByLogin(login)
  }

  async findByEmail(email: string): Promise<UserFullType | null> {
    return await this.usersRepository.findByEmail(email)
  }

  async findByLoginPass(shortCredentials: LoginType): Promise<UserFullType | null> {
    const userByLogin = await this.findByLogin(shortCredentials.login);
    if (userByLogin) {
      const isPassCorrect = await this.authService.isPasswordCorrect(shortCredentials.password, userByLogin.credentials.password);
      if (isPassCorrect) {
        return userByLogin
      }
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }


  async findByLoginOrEmail(login: any, email: any): Promise<string[]> {
    const result = await this.usersRepository.findByLoginOrEmail(login, email);
    return result
  }

  async updateToken(id: string, token: TokenType) {
    return await this.usersRepository.updateToken(id, token)
  }

  async findByCode(code: string) {
    return await this.usersRepository.findByCode(code);
  }
}

export const usersService = new UsersServices()