import {NextFunction, Request, Response} from "express";
import {RequestWithShortUser} from "../../db/types";
import {JwtUtility} from "../../application/jwt-utility";
import {rootContainer} from "../../ioc/compositionRoot";
import {UsersService} from "../../domain/users-service";
import { TYPES } from "../../db/iocTypes";

const usersService = rootContainer.get<UsersService>(TYPES.UsersService);
const jwtUtility = rootContainer.get<JwtUtility>(TYPES.JwtUtility);

export const bearerValidationMiddleware = async (req: RequestWithShortUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth) {
    const splitAuth = auth.split(" ")
    if (splitAuth[0] === "Bearer" && splitAuth[1]) {
      const jwtBase = splitAuth[1];
      const userId = await jwtUtility.extractUserIdFromToken(jwtBase);
      if (userId) {
        const user = await usersService.findById(userId);
        if (user) {
          req.user = {id: user.id, login: user.credentials.login};
          next();
          return;
        }
      }
    }
  }
  res.status(401).send()
}
