import {ErrorMessagesType, errorsMessagesCreator} from "../errorCommon/errorMessagesCreator";
import {baseErrorList} from "../errorCommon/baseErrorListHelper";

export const isValidUrl = (url: string) => {
  const check = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  //const check = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  //const check = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return check.test(url);
}
export const bloggerNameAndYoutubeURLErrorCreator = (errors: ErrorMessagesType | undefined, name: string, youtubeUrl?: string) => {
  if (!name || name.trim().length === 0 || name.length > 15) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Name must be present and contain corresponding quantity of characters",
      "name"
    );
  }
  if (!youtubeUrl || !isValidUrl(youtubeUrl) || youtubeUrl.length > 100) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Youtube URL must be correctly formatted",
      "youtubeUrl");
  }
  return errors;
}

