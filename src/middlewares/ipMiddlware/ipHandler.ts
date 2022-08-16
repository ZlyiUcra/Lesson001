import {NextFunction, Response} from "express";
import {RequestWithIP} from "../../db/types";

export const ipMiddleware = (req: RequestWithIP, res: Response,
                             next: NextFunction) => {
  const forwardedIpsStr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  req.clientIP = forwardedIpsStr as string;
  next();
};