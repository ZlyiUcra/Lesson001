import {ErrorMessagesType} from "./errorMessagesCreator";

export const isErrorsPresent = (errors: ErrorMessagesType | undefined) => {
  if (errors?.errorsMessages?.length) return true;
  return false
}