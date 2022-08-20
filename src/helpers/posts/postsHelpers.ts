import {ErrorMessagesType, errorsMessagesCreator, ErrorType} from "../errorCommon/errorMessagesCreator";
import {bloggersService} from "../../domain/bloggers-services";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";


export const postsTitleShorDescriptionContentErrorCreator = (errors: ErrorMessagesType | undefined,
                                                                   title?: string,
                                                                   shortDescription?: string,
                                                                   content?: string) => {

  if (!title || title.trim().length === 0 || title.length > 30) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Title must be present and contain corresponding quantity of characters",
      "title"
    );
  }
  if (!shortDescription || typeof shortDescription === "string" &&
    shortDescription.trim().length === 0 ||
    shortDescription &&
    shortDescription.length > 100) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "ShortDescription not correct",
      "shortDescription");
  }
  if (!content || typeof content === "string" &&
    content.trim().length === 0 ||
    content &&
    content.length > 1000) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Content not correct",
      "content");
  }

  return errors;
}


export const postsTitleShorDescriptionContentBloggerIdErrorCreator = async (errors: ErrorMessagesType | undefined,
                                                                   title?: string,
                                                                   shortDescription?: string,
                                                                   content?: string, bloggerId?: string) => {

  const blogger = await bloggersService.findById(bloggerId || '');
  if(!blogger){
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Blogger not exist",
      "bloggerId"
    );
  }

  errors = postsTitleShorDescriptionContentErrorCreator(errors, title, shortDescription, content)

  return errors;
}



