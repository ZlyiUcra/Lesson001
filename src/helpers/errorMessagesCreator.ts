export type ErrorType = {
  message: string,
  field: string,
};
export type ErrorMessagesType = {
  errorMessages: Array<ErrorType>;
}
export const errorMessagesCreator = (baseErrors: Array<ErrorType>,
                                     field?: string,
                                     message?: string):
  ErrorMessagesType | undefined => {
  if (field && message) {
    return {
      errorMessages: [...baseErrors, {field, message: message?.toLowerCase()}]
    }
  }
}