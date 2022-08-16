import bcrypt from 'bcrypt'
import {jwtUtility} from '../application/jwt-utility';
import {CredentialType, JWTType, LoginType, TOKEN_STATUS, TokenType} from "../db/types";
import {usersService} from "./users-services";
import {authRepository} from "../repositories/auth-repository";
import {v4 as uuidv4} from "uuid";
import {emailAdapter} from "../adapters/email-adapter";
import differenceInSeconds from "date-fns/differenceInSeconds";

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
      const isCorrectUserPassword = await this.isPasswordCorrect(credentials.password, user.passwordHash);
      if (isCorrectUserPassword) {
        const token = await jwtUtility.createJWT(user);

        // const authToken: TokenType = {
        //   id: uuidv4(),
        //   userId: user.id,
        //   ip,
        //   limitTimeCount: 0,
        //   token: token,
        //   confirmationToken: uuidv4(),
        //   createdAt: new Date(),
        //   lastRequestedAt: new Date()
        // }
        //const authTokenInfo = await authRepository.create(authToken);

        return {token}

      }
    }
    return null
  },

  async registration(credentials: CredentialType, ip?: string | null): Promise<boolean> {
    const user = await usersService.findByLoginAndEmail(credentials.login, credentials.email);
    if (user) {
      const isCorrectUserPassword = await this.isPasswordCorrect(credentials.password, user.passwordHash);
      if (isCorrectUserPassword) {

        const confirmationToken = uuidv4();

        const authToken: TokenType = {
          id: uuidv4(),
          userId: user.id,
          ip: ip ? ip : null,
          limitTimeCount: 0,
          confirmationToken,
          createdAt: new Date(),
          lastRequestedAt: new Date(),
          tokenStatus: TOKEN_STATUS.SENT,
          tokenJWT: ''
        }

        const message = `Please confirm you email cliking on this <a href="http://localhost:5000/auth/confirm-registration?code=${authToken.confirmationToken}"><b>LINK</b></a>`;
        const authUser = await this.findByUserId(user.id);
        try {
          /* TODO:  Parsing of infoEmail must be implemented */
          // Returned value
          if (!authUser) {
            const infoEmail = await emailAdapter.sendEmail(credentials.email, "Registration's confirmation", message);
            await authRepository.create(authToken);
          } else {
            await this.updateRequestInfo(authUser);
          }
          return true
        } catch (err) {
          return false
        }
      }
    }
    return false
  },

  async emailResending(email: string, ip: string): Promise<boolean> {
    const user = await usersService.findByEmail(email);
    if (user) {
      let authUser = await this.findByUserIdAndIP(user.id, ip);
      if (authUser) {
        const confirmationToken = uuidv4();
        const message = `Please confirm you email cliking on this <a href="http://localhost:5000/auth/confirm-registration?code=${confirmationToken}"><b>LINK</b></a>`;

        const newAuthUser: TokenType = {
          ...authUser,
          tokenStatus: TOKEN_STATUS.RESENT,
          confirmationToken,
          limitTimeCount: 1
        }
        try {
          /* TODO:  Parsing of infoEmail must be implemented */
          if (authUser.tokenStatus === TOKEN_STATUS.SENT) {
            await emailAdapter.sendEmail(email, "Email Resending", message);
            await authRepository.emailResending(newAuthUser);
          } else {
            await this.updateRequestInfo(authUser);
          }
          // Returned value
          return true;
        } catch (err) {
          return false
        }
      }
    }
    return false
  },

  async findByUserIdAndIP(userId: string, ip: string): Promise<TokenType | null> {
    return authRepository.findByUserIdAndIP(userId, ip);
  },
  async findByLoginAndIP(login: string, ip: string): Promise<TokenType | null> {
    const userAuth = await usersService.findByLogin(login);
    if (userAuth) {
      return await this.findByUserIdAndIP(userAuth.id, ip);
    }
    return null
  },
  async findByUserId(userId: string): Promise<TokenType | null> {
    return await authRepository.findByUserId(userId);
  },
  async findById(id: string): Promise<TokenType | null> {
    return await authRepository.findById(id);
  },
  async findByEmailAndIP(email: string, ip: string): Promise<TokenType | null> {
    const userAuth = await usersService.findByEmail(email);
    if (userAuth) {
      return await this.findByUserIdAndIP(userAuth.id, ip);
    }
    return null
  },

  async updateRequestInfo(authUser: TokenType): Promise<void> {
    const timeDifference = differenceInSeconds(new Date(), authUser.lastRequestedAt);
    if (timeDifference < 10) {
      await authRepository.updateAttemptsShortTimeCounter(authUser.userId, authUser.limitTimeCount + 1);
    } else if (timeDifference > 30) {
      await authRepository.updateAttemptsShortTimeCounter(authUser.userId, 1);
    }
  },
  async emailConfirmedByCodeAndIP(confirmationToken: string, clientIP: string): Promise<boolean> {
    const userAuth = await this.updateStatusForCodeAndIP(confirmationToken, clientIP);

    if(userAuth){
      return true;
    }
    return false;

  },
  async findByCodeAndIP(code: string, clientIP: string): Promise<TokenType | null> {
    return await authRepository.findByCodeAndIP(code, clientIP);
  },
  async updateStatusForCodeAndIP(code: string, clientIP: string): Promise<TokenType | null> {
    let userAuth = await authRepository.findByCodeAndIP(code, clientIP);
    if(userAuth){
      if(userAuth.tokenStatus !== TOKEN_STATUS.CONFIRMED){

        const newUserAuth = {
          ...userAuth,
          limitTimeCount: 1,
          lastRequestedAt: new Date(),
          tokenStatus: TOKEN_STATUS.CONFIRMED
        }
        await authRepository.update(newUserAuth);
        return this.findById(newUserAuth.id);

      } else {
        await this.updateRequestInfo(userAuth)
      }

    }
    return userAuth
  }
}