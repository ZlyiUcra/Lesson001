import {NextFunction, Response} from "express";
import {RequestWithInternetData} from "../../db/types";


export const addIPMiddleware = async (req: RequestWithInternetData, res: Response,
                                      next: NextFunction) => {
  const forwardedIpsStr = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

  req.clientIP = forwardedIpsStr;

  next();
};