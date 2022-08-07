import {NextFunction, Request, Response} from "express";
import {authBasicParsing} from "../helpers/auth/validators";
import {bloggersService} from "../domain/bloggers-services";

export const authBasicValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && authBasicParsing(req.headers.authorization)) {
    next();
  } else return res.status(401).send();
};

