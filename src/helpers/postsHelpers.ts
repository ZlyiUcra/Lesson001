import {ErrorMessagesType, errorsMessagesCreator} from "./errorMessagesCreator";

export const postsErrorCreator = (errors: ErrorMessagesType | undefined,
                                  title?: string,
                                  shortDescription?: string,
                                  content?: string,
                                  bloggerId?: number) => {
  const baseErrorList = errors?.errorsMessages ? errors.errorsMessages : [];
  if (!title || title.trim().length === 0 || title.length > 30) {
    errors = errorsMessagesCreator(baseErrorList,
      "Title must be present and contain corresponding quantity of characters",
      "title"
    );
  }
  if (typeof shortDescription === "string" &&
    shortDescription.trim().length === 0 ||
    shortDescription &&
    shortDescription.length > 30) {
    errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
      "ShortDescription not correct",
      "shortDescription");
  }
  if (typeof content === "string" &&
    content.trim().length === 0 ||
    content &&
    content.length > 30) {
    errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
      "Content not correct",
      "content");
  }
  if (typeof bloggerId !== "number" ) {
    errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
      "BloggerId not correct",
      "bloggerId");
  }
  return errors;
}