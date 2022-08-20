import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {authService} from "../../domain/auth-services";
import {TOKEN_STATUS} from "../../db/types";
import {userLoginPasswordErrorCreator} from "../user/userHelper";




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