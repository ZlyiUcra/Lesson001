export type ErrorType = {
  message: string,
  title: string,
};
export type ErrorMessagesType = {
  errorMessages: Array<ErrorType>;
}
export const errorMessagesCreator = (baseErrors: Array<ErrorType>,
                                     title?: string,
                                     message?: string):
  ErrorMessagesType | undefined => {
  if (title && message) {
    return {
      errorMessages: [...baseErrors, {title, message: message?.toLowerCase()}]
    }
  }
}