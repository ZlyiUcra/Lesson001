import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {authService} from "../../domain/auth-services";
import {AttemptsType, TOKEN_STATUS} from "../../db/types";
import {isValidEmail, userLoginPasswordErrorCreator} from "../user/userHelper";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {settings} from "../../settings";


// export const userExistsCreator = async (errors: ErrorMessagesType | undefined, login: string) => {
//   // const user = await usersService.findByLogin(login);
//   // if (user !== null) {
//   //   errors = errorsMessagesCreator(baseErrorList(errors),
//   //     "User with this login already exist in DB",
//   //     "login"
//   //   );
//   // }
//   return errors;
// }
//
// export const loginAndEmailExistCreator = (errors: ErrorMessagesType | undefined) => {
//
//   errors = errorsMessagesCreator(baseErrorList(errors),
//     "Login and email already already exist in DB",
//     "login")
//   return errors;
// }
//
// export const userAlreadyRegistered = (errors: ErrorMessagesType | undefined, field: string) => {
//   errors = errorsMessagesCreator(baseErrorList(errors),
//     `User with ${field} already exists in DB`,
//     field
//   );
//   return errors;
// }

//export const confirmationCodeErrorCreator = async (errors: ErrorMessagesType | undefined, code: string, ip: string) => {
// const userAuth = await authService.findByCodeAndIP(code);
// if (!userAuth) {
//   errors = errorsMessagesCreator(baseErrorList(errors),
//     "Incorrect code information",
//     "code"
//   );
// } else if(userAuth.tokenStatus === TOKEN_STATUS.CONFIRMED) {
//   errors = errorsMessagesCreator(baseErrorList(errors),
//     "Authentication already passed",
//     "code"
//   );
// }

//   return errors;
// }

export const authLoginEmailErrorCreator = (errors: ErrorMessagesType | undefined,
                                           login: string,
                                           password: string,
) => {
  return userLoginPasswordErrorCreator(errors, login, password)
}


export const authRegistrationEmailValidationCreator = async (errors: ErrorMessagesType | undefined, email: string) => {
  if (!isValidEmail(email)) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect email",
      "email"
    );
  }
  const user = await usersService.findByEmail(email);
  if (!user) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "User does not exist with this email",
      "email"
    );
  } else if (user.token.tokenStatus === TOKEN_STATUS.CONFIRMED) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Registration already passed",
      "email"
    );
  }
  return errors;
}

export const is429Status = (attempts: AttemptsType): boolean => {
  const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
  if (timeDifference < settings.TIME_LIMIT && attempts.limitTimeCount >= settings.ATTEMPTS_TOKEN_LIMIT) {
    return true
  }
  return false
}


export const authLoginPassEmailErrorCreator = (errors: ErrorMessagesType | undefined, login: string, password: string, email: string) => {
  errors = userLoginPasswordErrorCreator(errors, login, password);
  if (!isValidEmail(email)) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Email must be correctly formatted",
      "email"
    );
  }
  return errors;
}
export const authCodeConfirmationValidationCreator = (errors: ErrorMessagesType | undefined) => {

  return errorsMessagesCreator(baseErrorList(errors),
      "Confirmation code doesn't exist",
      "code"
    );

}


export const authLoginOrEmailAlreadyExistsErrorCreator = (errors: ErrorMessagesType | undefined, fieldsList: string[]) => {
  fieldsList.forEach(field => {
    errors = errorsMessagesCreator(baseErrorList(errors),
      `User with ${field} already exist`,
      `${field}`
    );
  })
  return errors;
}
