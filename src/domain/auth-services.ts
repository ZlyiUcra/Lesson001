import "reflect-metadata";
import {JwtUtility} from '../application/jwt-utility';
import {CredentialType, JWTType, LoginType, TOKEN_STATUS, TokenType, UserFullType} from "../db/types";
import {UsersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {userForRepository} from "../helpers/user/userServiceHelper";
import {inject, injectable} from "inversify";
import {EmailAdapter} from "../adapters/email-adapter";
import {TYPES} from "../db/iocTypes";
import {AuthHelperService} from "./auth-helper-service";
import {EmailMessage} from '../adapters/email-message';

@injectable()
export class AuthService {
  constructor(
    @inject<UsersRepository>(TYPES.UsersRepository) private usersRepository: UsersRepository,
    @inject<AuthHelperService>(TYPES.AuthHelperService) private authHelperService: AuthHelperService,
    @inject<JwtUtility>(TYPES.JwtUtility) private jwtUtility: JwtUtility,
    @inject<EmailAdapter>(TYPES.EmailAdapter) private emailAdapter: EmailAdapter,
    @inject<EmailMessage>(TYPES.EmailMessage) private emailMessage: EmailMessage) {
  }


  async login(credentials: LoginType, expiresIn = "1h"): Promise<JWTType & { user: UserFullType } | null> {
    const user = await this.usersRepository.findByLogin(credentials.login);
    if (user !== null) {
      const isCorrectUserPassword = await this.authHelperService.isPasswordCorrect(credentials.password, user.credentials.password);
      if (isCorrectUserPassword) {
        const accessToken = await this.jwtUtility.createUserJWT({
          id: user.id,
          login: user.credentials.login,
          email: user.credentials.email
        }, expiresIn);
        const result = {accessToken, user}
        return result
      }
    }
    return null
  }

  async registration(credentials: CredentialType): Promise<boolean> {
    let user = await userForRepository(credentials, this.authHelperService, TOKEN_STATUS.NONE)
    user = await this.usersRepository.create(user);
    const message = this.emailMessage.getMessage(user.token.confirmationToken);
    //`<a href="https://it-kamasutra-lesson-01.herokuapp.com/auth/registration-confirmation/?code=${user.token.confirmationToken}">${user.token.confirmationToken}</a>`;


    try {
      /* TODO:  Parsing of infoEmail must be implemented */
      // Returned value
      this.emailAdapter.sendEmail(user.credentials.email, "Registration's confirmation", message);

      return await this.usersRepository.updateTokenStatus(user.id, TOKEN_STATUS.SENT);

    } catch (err) {
      return false
    }
    return false
  }

  async emailResending(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      const confirmationToken = uuidv4();
      const message = this.emailMessage.getMessage(confirmationToken);
      // const message = `<a href="https://it-kamasutra-lesson-01.herokuapp.com/auth/registration-confirmation/?code=${confirmationToken}">${confirmationToken}</a>`;

      const token: TokenType = {
        ...user.token,
        confirmationToken,
        tokenStatus: TOKEN_STATUS.RESENT
      }
      try {
        /* TODO:  Parsing of infoEmail must be implemented */
        if (user.token.tokenStatus !== TOKEN_STATUS.CONFIRMED) {
          this.emailAdapter.sendEmail(email, "Email Resending", message);
          return await this.usersRepository.updateToken(user.id, token);
        } else {
          return false
        }
      } catch (err) {
        return false
      }
    }
    return false
  }

  async emailConfirmedByCode(confirmationToken: string): Promise<boolean> {
    const user = await this.usersRepository.findByCode(confirmationToken);
    if (user) {
      return await this.usersRepository.updateTokenStatus(user.id, TOKEN_STATUS.CONFIRMED);
    }
    return false;
  }
}
