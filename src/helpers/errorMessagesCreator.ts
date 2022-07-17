export type ErrorType = {
  message: string,
  field: string,
};
export type ErrorMessagesType = {
  errorsMessages: Array<ErrorType>;
}
export const errorMessagesCreator = (baseErrors: Array<ErrorType>,
                                     message?: string,
                                     field?: string):
  ErrorMessagesType | undefined => {
  if ( message && field) {
    return {
      errorsMessages: [...baseErrors, {message: message, field: field.toLowerCase()}]
    }
  }
}