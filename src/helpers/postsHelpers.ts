import {ErrorMessagesType, errorsMessagesCreator, ErrorType} from "./errorCommon/errorMessagesCreator";
import {bloggersService} from "../domain/bloggers-services";
import {baseErrorList} from "./errorCommon/baseErrorListHelper";


export const postsErrorCreator = async (errors: ErrorMessagesType | undefined,
                                        title?: string,
                                        shortDescription?: string,
                                        content?: string,
                                        bloggerId?: string) => {

  if (!title || title.trim().length === 0 || title.length > 30) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Title must be present and contain corresponding quantity of characters",
      "title"
    );
  }
  if (!shortDescription || typeof shortDescription === "string" &&
    shortDescription.trim().length === 0 ||
    shortDescription &&
    shortDescription.length > 30) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "ShortDescription not correct",
      "shortDescription");
  }
  if (!content || typeof content === "string" &&
    content.trim().length === 0 ||
    content &&
    content.length > 30) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Content not correct",
      "content");
  }

  if (!bloggerId) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "BloggerId must be present",
      "bloggerId")
  }
  // else {
  //   const blogger = await bloggersService.findById(bloggerId)
  //   if (!blogger) {
  //     errors = errorsMessagesCreator(baseErrorList(errors),
  //       "BloggerId must be present and correct",
  //       "bloggerId")
  //   }
  // }
  return errors;
}