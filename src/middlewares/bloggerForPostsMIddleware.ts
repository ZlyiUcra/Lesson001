import {NextFunction, Request, Response} from "express";
import {bloggersService} from "../domain/bloggers-services";

export const bloggerForPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  if (req.params.bloggerId) {
    const blogger = await bloggersService.findById(+req.params.bloggerId);
    if (blogger !== null) {
      next();
      return;
    }
  }
  return res.status(404).send();
};