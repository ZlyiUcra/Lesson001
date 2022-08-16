import {UserType} from "../db/types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtUtility = {
  /**
   * @param admin
   * @return Returns JWT-token
   */
  async createJWT(user: UserType, expiresIn: string = '1h') {
    return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn})

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