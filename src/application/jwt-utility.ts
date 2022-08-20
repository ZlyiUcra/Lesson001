import {UserShortType} from "../db/types";
import jwt, {JwtPayload} from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtUtility = {
  /**
   * @param admin
   * @return Returns JWT-token
   */
  async createJWT(user: UserShortType, expiresIn: string = '1h') {
    return jwt.sign({id: user.id}, settings.JWT_SECRET, {expiresIn})

  },
  async extractUserIdFromToken(token: string): Promise<string | null> {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as JwtPayload;
      return result.id
    } catch (error) {
      return null
    }
  }
}