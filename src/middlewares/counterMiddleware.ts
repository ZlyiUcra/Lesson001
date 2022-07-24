import {NextFunction, Request, Response} from "express";

const counter = {Count: 0}

export const counterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  counter.Count += 1;
  res.set(counter);
  next();
}