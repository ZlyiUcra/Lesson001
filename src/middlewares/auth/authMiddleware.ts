import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";
import {isValidEmail} from "../../helpers/user/userHelper";
import {NextFunction, Request, Response} from "express";
import {authLoginEmailErrorCreator} from "../../helpers/auth/authHeplers";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";

export const authLoginPassValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const {login, password} = req.body;

  errors = authLoginEmailErrorCreator(errors, login, password);


  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};