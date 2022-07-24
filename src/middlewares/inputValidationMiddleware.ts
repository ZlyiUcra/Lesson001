import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";

export const titleValidator = body('title').isLength({max: 15}).withMessage('Max 15 symbols').matches(/^[\w ]*$/)

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).send({errors: errors.array()});
  } else {
    next();
  }
}