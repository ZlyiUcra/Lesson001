import {Request, Response, NextFunction} from "express";

const blackList = ["localhost"]//["127.0.0.1", "localhost"]

export const blacklistValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (blackList.find(ble => ble === req.hostname)) {
    res.status(401).send()
  } else next();
}