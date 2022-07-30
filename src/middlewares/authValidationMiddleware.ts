import {NextFunction, Request, Response} from "express";
import {authParsing} from "../helpers/validators";
import {bloggersService} from "../domain/bloggers-services";

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && authParsing(req.headers.authorization)) {
    next();
  } else return res.status(401).send();
};

