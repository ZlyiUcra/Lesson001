export type ErrorType = {
  message: string,
  field: string,
};
export type ErrorMessagesType = {
  errorMessages: Array<ErrorType>;
}
export const errorMessagesCreator = (baseErrors: Array<ErrorType>,
                                     message?: string,
                                     field?: string):
  ErrorMessagesType | undefined => {
  if ( message && field) {
    return {
      errorMessages: [...baseErrors, {message: message, field: field.toLowerCase()}]
    }
  }
}