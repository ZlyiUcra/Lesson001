import bcrypt from 'bcrypt'
import {jwtUtility} from '../application/jwt-utility';
import {CredentialType, JWTType, LoginType, TOKEN_STATUS} from "../db/types";
import {usersService} from "./users-services";
import {emailAdapter} from "../adapters/email-adapter";
import {usersRepository} from "../repositories/users-repository";

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
      return  await usersRepository.setTokenStatus(user.id, TOKEN_STATUS.SENT);

    } catch (err) {
      return false
    }

    return false
  },
  //
  // async emailResending(email: string, ip: string): Promise<boolean> {
  //   const user = await usersService.findByEmail(email);
  //   if (user) {
  //     let authUser = await this.findByUserId(user.id);
  //     if (authUser) {
  //       const confirmationToken = uuidv4();
  //       const message = `Please confirm you email cliking on this <a href="http://localhost:5000/auth/confirm-registration?code=${confirmationToken}"><b>LINK</b></a>`;
  //
  //       const newAuthUser: TokenType = {
  //         ...authUser,
  //         tokenStatus: TOKEN_STATUS.RESENT,
  //         confirmationToken,
  //       }
  //       try {
  //         /* TODO:  Parsing of infoEmail must be implemented */
  //         if (authUser.tokenStatus === TOKEN_STATUS.SENT) {
  //           await emailAdapter.sendEmail(email, "Email Resending", message);
  //           await authRepository.emailResending(newAuthUser);
  //         } else {
  //           return false
  //         }
  //         // Returned value
  //         return true;
  //       } catch (err) {
  //         return false
  //       }
  //     }
  //   }
  //   return false
  // },
  //
  // async findByUserId(userId: string): Promise<TokenType | null> {
  //   return authRepository.findByUserId(userId);
  // },
  // async findByLoginAndIP(login: string, ip: string): Promise<TokenType | null> {
  //   const userAuth = await usersService.findByLogin(login);
  //   if (userAuth) {
  //     return await this.findByUserId(userAuth.id);
  //   }
  //   return null
  // },
  // async findById(id: string): Promise<TokenType | null> {
  //   return await authRepository.findById(id);
  // },
  // async emailConfirmedByCodeAndIP(confirmationToken: string, clientIP: string): Promise<boolean> {
  //   const userAuth = await this.updateStatusForCodeAndIP(confirmationToken, clientIP);
  //
  //   if (userAuth) {
  //     return true;
  //   }
  //   return false;
  //
  // },
  // async findByCodeAndIP(code: string): Promise<TokenType | null> {
  //   return await authRepository.findByCode(code);
  // },
  // async updateStatusForCodeAndIP(code: string, clientIP: string): Promise<TokenType | null> {
  //   let userAuth = await authRepository.findByCode(code);
  //   if (userAuth) {
  //     if (userAuth.tokenStatus !== TOKEN_STATUS.CONFIRMED) {
  //
  //       const newUserAuth = {
  //         ...userAuth,
  //         limitTimeCount: 1,
  //         lastRequestedAt: new Date(),
  //         tokenStatus: TOKEN_STATUS.CONFIRMED
  //       }
  //       await authRepository.update(newUserAuth);
  //       return this.findById(newUserAuth.id);
  //
  //     } else {
  //       return null
  //     }
  //
  //   }
  //   return userAuth
  // }
}