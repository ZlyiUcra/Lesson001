import {NextFunction, Request, Response} from "express";


export const jsonValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["content-type"] === 'application/json') {
    next();
  }
  res.status(400).send();
}