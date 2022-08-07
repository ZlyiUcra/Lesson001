import bcrypt from 'bcrypt'
import {JWTType, LoginType, UserType} from "../db/types";
import {usersService} from "./users-services";
import {jwtHelper} from "../helpers/jwt/jwtHelper";

export const authService = {
  async generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10)
    return hash
  },
  async isPasswordCorrect(password: string, hash: string) {
    const compareResult: boolean = await bcrypt.compare(password, hash)
    return compareResult
  },
  async login(credentials: LoginType): Promise<JWTType | null> {
    const user = await usersService.findByLogin(credentials.login);
    if (user !== null) {
      const isCorrectUserPassword = await this.isPasswordCorrect(credentials.password, user.passwordHash );
      if(isCorrectUserPassword) {
        return await jwtHelper.createJWT(user)
      }
    }
    return null
  }
}