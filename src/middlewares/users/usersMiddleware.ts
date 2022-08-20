import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {userCreateErrorCreator, userExistsErrorCreator, userNotExistsErrorCreator} from "../../helpers/user/userHelper";

export const userCreateValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = userCreateErrorCreator(errors, req.body.login || "", req.body.password || "", req.body.email || "");

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};

export const userAlreadyExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = await userExistsErrorCreator(errors, req.body.login || "", req.body.email || "")

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }
}

export const userAlreadyNotExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = await userNotExistsErrorCreator(errors, req.params.id || "")

  if (isErrorsPresent(errors)) {
    return res.status(404).send(errors);
  } else {
    next()
  }
}
