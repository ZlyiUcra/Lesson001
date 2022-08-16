import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {loginPassErrorCreator} from "../auth/authHeplers";
import {authService} from "../../domain/auth-services";

export const isValidEmail = (email: string) => {
  const check = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const result = check.test(email);
  return result;

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
export const emailNotExistInDBCreator = async (errors: ErrorMessagesType | undefined, email: string) => {
  const user = await usersService.findByEmail(email);
  if (!user) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "User does not exist with this email",
      "email"
    );
  } else {
    const authUser = await authService.findByUserId(user.id);
    if (!authUser) {
      errors = errorsMessagesCreator(baseErrorList(errors),
        "Register email wasn't send for user",
        "email"
      );
    }
  }
  if (!isValidEmail(email)) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect email",
      "email"
    );
  }
  return errors;

}
export const loginPassEmailErrorCreator = (errors: ErrorMessagesType | undefined, loginLength: number, passwordLength: number, email: string) => {
  errors = loginPassErrorCreator(errors, loginLength, passwordLength);
  errors = emailErrorCreator(errors, email)
  return errors;
}



