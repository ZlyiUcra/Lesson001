import {ErrorMessagesType, ErrorType} from "./errorMessagesCreator";

export const baseErrorList = (errors: ErrorMessagesType | undefined): ErrorType[] =>
  errors?.errorsMessages ? errors.errorsMessages : [];