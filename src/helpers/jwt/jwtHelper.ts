import {JWTType, UserType} from "../../db/types";
import jwt from 'jsonwebtoken'
import {settings} from "../../settings";

export const jwtHelper = {
  async createJWT(user: UserType): Promise<JWTType> {
    return {token: jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})}
  },
  async extractUserIdFromToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return result.userId
    } catch (error) {
      return null
    }
  }
}