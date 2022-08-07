import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-services";
import {jwtHelper} from "../helpers/jwt/jwtHelper";
import {RequestWithUser, UserType} from "../db/types";


export const bearerValidationMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth) {
    const splitAuth = auth.split(" ")
    if (splitAuth[0] === "Bearer" && splitAuth[1]) {
      const jwtBase = splitAuth[1];
      const userId = await jwtHelper.extractUserIdFromToken(jwtBase);
      if (userId) {
        const user = await usersService.findById(userId);
        if (user) {
          req.user = user;
          next();
          return;
        }
      }
    }
  }
  res.status(401).send()

}
