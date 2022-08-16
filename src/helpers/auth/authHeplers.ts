import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {authService} from "../../domain/auth-services";
import {TOKEN_STATUS} from "../../db/types";


export const loginPassErrorCreator = (errors: ErrorMessagesType | undefined,
                                      loginLength: number,
                                      passwordLength: number) => {
  if (loginLength < 3 || loginLength > 10) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Login must contain from 3 to 10 symbols",
      "login"
    );
  }
  if (passwordLength < 6 || passwordLength > 20) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Password must contain from 6 to 20 symbols",
      "password"
    );
  }

  return errors
}

export const userExistsCreator = async (errors: ErrorMessagesType | undefined, login: string) => {
  const user = await usersService.findByLogin(login);
  if (user !== null) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "User with this login already exist in DB",
      "login"
    );
  }
  return errors;
}

export const loginAndEmailExistCreator = (errors: ErrorMessagesType | undefined) => {

  errors = errorsMessagesCreator(baseErrorList(errors),
    "Login and email already already exist in DB",
    "login")
  return errors;
}

export const userAlreadyRegistered = (errors: ErrorMessagesType | undefined) => {
  errors = errorsMessagesCreator(baseErrorList(errors),
    "User Already pass registration in DB",
    "login"
  );
  return errors;
}

export const confirmationCodeErrorCreator = async (errors: ErrorMessagesType | undefined, code: string, ip: string) => {
  const userAuth = await authService.findByCodeAndIP(code, ip);
  if (!userAuth) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect code information",
      "code"
    );
  }
  // if (userAuth?.tokenStatus === TOKEN_STATUS.CONFIRMED) {
  //   errors = userAlreadyRegistered(errors)
  // }
  return errors;
}