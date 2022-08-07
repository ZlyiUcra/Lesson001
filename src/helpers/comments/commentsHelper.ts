import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";
import {isValidUrl} from "../bloggers/bloggersHelpers";
import {usersService} from "../../domain/users-services";
import {postsService} from "../../domain/posts-services";

export const commentErrorCreator = async (errors: ErrorMessagesType | undefined, content: string) => {
  if (!content || content.trim().length === 0 || content.length < 15 || content.length > 300) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Content must be present and contain corresponding quantity of characters",
      "content"
    );
  }
  return errors;
}

export const commentCorrectPostIdValidator = async (postId?: string) => {
  if (!postId) return false;
  const post = await postsService.findById(postId);
  if (!post) {
    return false;
  }
  return true;
}