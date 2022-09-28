import "reflect-metadata";
import {UserJWTType, UserShortType} from "../db/types";
import jwt, {decode, JwtPayload} from 'jsonwebtoken'
import {settings} from "../settings";
import {injectable} from "inversify";


@injectable()
export class JwtUtility {
  /**
   * @param user
   * @return Returns JWT-token
   */
  async createJWT(user: UserShortType, expiresIn: string = '1h') {
    return jwt.sign({id: user.id, login: user.login}, settings.JWT_SECRET, {expiresIn})
  }
  async createUserJWT(user: UserJWTType, expiresIn: string = '1h') {
    return jwt.sign({id: user.id, login: user.login, email: user.email}, settings.JWT_SECRET, {expiresIn})
  }
  async extractUserIdFromToken(token: string): Promise<string | null> {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as JwtPayload;
      return result.id
    } catch (error) {
      return null
    }
  }
  async extractUserJWTFromToken(token: string): Promise<UserShortType | null> {
    try {
      // noinspection JSVoidFunctionReturnValueUsed
      const result = await jwt.verify(token, settings.JWT_SECRET, (error, decoded) => {
        if (error) {
          throw new Error(error.message);
        }
        if (typeof decoded === "string" || decoded === undefined) {
          return null;
        }
        return decoded;
      }) as unknown as JwtPayload | null;

      if (!result) {
        return null
      }
      // const now = new Date().valueOf()
      // console.log(result.exp as number - Math.round(now/1000))
      return {id: result.id, login: result.login};

    } catch (error) {
      // console.log(error)
      return null
    }
  }
  async extractCompleteUserJWTFromToken(refreshToken: string): Promise<{id: string, login: string, email: string} | null> {
    try {
      // noinspection JSVoidFunctionReturnValueUsed
      const result = await jwt.verify(refreshToken, settings.JWT_SECRET, (error, decoded) => {
        if (error) {
          throw new Error(error.message);
        }
        if (typeof decoded === "string" || decoded === undefined) {
          return null;
        }
        return decoded;
      }) as unknown as JwtPayload | null;

      if (!result) {
        return null
      }
      //const now = new Date().valueOf()
      //console.log(result.exp as number - Math.round(now/1000))
      return {id: result.id, login: result.login, email: result.email};

    } catch (error) {
      //console.log(error)
      return null
    }
  }
}