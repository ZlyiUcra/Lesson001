import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {usersService} from "../../domain/users-services";
import {AttemptsType, TOKEN_STATUS} from "../../db/types";
import {isValidEmail, userLoginPasswordErrorCreator} from "../user/userHelper";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {settings} from "../../settings";
import {attemptsService} from "../../domain/attempts-service";


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

export const is429Status = async (attempts: AttemptsType): Promise<boolean> => {
  const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
  if (timeDifference < settings.TIME_LIMIT && attempts.limitTimeCount >= settings.ATTEMPTS_TOKEN_LIMIT) {
    return true
  }
  if(timeDifference > settings.TIME_LIMIT){
    await attemptsService.update(attempts.ip as string, attempts.url as string, attempts.method as string, 0)
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
export const authConfirmedValidationCreator = (errors: ErrorMessagesType | undefined) => {

  return errorsMessagesCreator(baseErrorList(errors),
    "Token already confirmed",
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
