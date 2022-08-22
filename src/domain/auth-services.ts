import bcrypt from 'bcrypt'
import {jwtUtility} from '../application/jwt-utility';
import {CredentialType, JWTType, LoginType, TOKEN_STATUS, TokenType} from "../db/types";
import {usersService} from "./users-services";
import {emailAdapter} from "../adapters/email-adapter";
import {usersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';

export const authService = {
  async generateHash(password: string, saltOrRounds: number = 10): Promise<string> {
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  },
  async isPasswordCorrect(password: string, hash: string) {
    const compareResult: boolean = await bcrypt.compare(password, hash)
    return compareResult
  },
  async login(credentials: LoginType, ip: string): Promise<JWTType | null> {
    const user = await usersService.findByLogin(credentials.login);
    if (user !== null) {
      const isCorrectUserPassword = await this.isPasswordCorrect(credentials.password, user.credentials.password);
      if (isCorrectUserPassword) {
        const token = await jwtUtility.createJWT({id: user.id, login: user.credentials.login});
        return {token}
      }
    }
    return null
  },

  async registration(credentials: CredentialType): Promise<boolean> {
    let user = await usersService.findByLoginEmailPass(credentials);
    if(!user) {
      user = await usersService.create(credentials) //, TOKEN_STATUS.SENT
    }

    const message = `${user.token.confirmationToken}`;

    try {
      /* TODO:  Parsing of infoEmail must be implemented */
      // Returned value
      const sentInfo = await emailAdapter.sendEmail(user.credentials.email, "Registration's confirmation", message);
      //const token = await authRepository.create(authToken);
      return  await usersRepository.updateTokenStatus(user.id, TOKEN_STATUS.SENT);

    } catch (err) {
      return false
    }

    return false
  },

  async emailResending(email: string): Promise<boolean> {
    const user = await usersService.findByEmail(email);
    if (user) {
      const confirmationToken = uuidv4();
      const message = `${confirmationToken}`;

      const token: TokenType = {
        ...user.token,
        confirmationToken,
        tokenStatus: TOKEN_STATUS.RESENT
      }
      try {
        /* TODO:  Parsing of infoEmail must be implemented */
        if (user.token.tokenStatus !== TOKEN_STATUS.CONFIRMED) {
          await emailAdapter.sendEmail(email, "Email Resending", message);
          return await usersService.updateToken(user.id, token);
        } else {
          return false
        }
      } catch (err) {
        return false
      }
    }
    return false
  },

  async emailConfirmedByCodeAndIP(confirmationToken: string): Promise<boolean> {
    const user = await usersService.findByCode(confirmationToken);
    if (user) {
      return  await usersRepository.updateTokenStatus(user.id, TOKEN_STATUS.CONFIRMED);
    }
    return false;
  }
}