import {ErrorMessagesType, errorsMessagesCreator} from "./errorMessagesCreator";

export const isValidUrl = (url: string) => {
  const check = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  //const check = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  //const check = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return check.test(url);
}
export const bloggerErrorCreator = (errors: ErrorMessagesType | undefined, name: string, youtubeUrl?: string) => {
  const baseErrorList = errors?.errorsMessages ? errors.errorsMessages : [];
  if (!name || name.trim().length === 0 || name.length > 15) {
    errors = errorsMessagesCreator(baseErrorList,
      "Name must be present and contain corresponding quantity of characters",
      "name"
    );
  }
  if (typeof youtubeUrl === "string" && !isValidUrl(youtubeUrl) || (youtubeUrl && youtubeUrl.length > 100)) {
    errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
      "Youtube URL must be correctly formatted",
      "youtubeUrl");
  }
  return errors;
}

