import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {postsService} from "../../domain/posts-services";

export const commentContentErrorCreator = (errors: ErrorMessagesType | undefined, content: string) => {
  if (!content || content.trim().length === 0 || content.length < 20 || content.length > 300) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Content must be present and contain corresponding quantity of characters",
      "content"
    );
  }
  return errors;
}