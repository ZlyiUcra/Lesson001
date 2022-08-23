import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {authService} from "../../domain/auth-services";
import {TOKEN_STATUS} from "../../db/types";

export const isValidEmail = (email: string) => {
  const check = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const result = check.test(email);
  return result;

}

export const userCreateErrorCreator = (errors: ErrorMessagesType | undefined,
                                       login: string,
                                       password: string,
                                       email: string) => {

  errors = userLoginPasswordErrorCreator(errors, login, password);
  if (!isValidEmail(email)) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Email must be correctly formatted",
      "email"
    );
  }
  return errors
}

export const userLoginPasswordErrorCreator = (errors: ErrorMessagesType | undefined,
                                              login: string,
                                              password: string) => {
  if (login.length < 3 || login.length > 10) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Login must contain from 3 to 10 symbols",
      "login"
    );
  }
  if (password.length < 6 || password.length > 20) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Password must contain from 6 to 20 symbols",
      "password"
    );
  }
  return errors
}

export const userExistsErrorCreator = async (errors: ErrorMessagesType | undefined,
                                             login: string,
                                             email: string) => {

  const userByLogin = await usersService.findByLogin(login)
  const userByEmail = await usersService.findByEmail(email)
  if (userByLogin) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Login already exist",
      "login"
    );
  }
  if (userByEmail) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Email already exist",
      "email"
    );
  }
  return errors
}

export const userNotExistsErrorCreator = async (errors: ErrorMessagesType | undefined, id: string) => {
  const userById = await usersService.findById(id);

  if (!userById) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "User not exist",
      "id"
    );
  }
  return errors
}

export const emailErrorCreator = (errors: ErrorMessagesType | undefined, email: string) => {
  if (!isValidEmail(email)) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect email",
      "email"
    );
  }
  return errors;

}





