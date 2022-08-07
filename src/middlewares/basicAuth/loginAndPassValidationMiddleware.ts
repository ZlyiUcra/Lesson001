import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {loginPassErrorCreator, userExistsCreator} from "../../helpers/auth/authHeplers";

export const loginAndPassValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const loginLength = req.body.login ? req.body.login.length : 0;
  const passLength = req.body.password ? req.body.password.length : 0;

  errors = loginPassErrorCreator(errors, loginLength, passLength);
  //errors = await userExistsCreator(errors, req.body.login);

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};

