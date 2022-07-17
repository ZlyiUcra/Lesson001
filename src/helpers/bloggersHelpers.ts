import {ErrorMessagesType, errorsMessagesCreator} from "./errorMessagesCreator";

export const isValidUrl = (url: string) => {
  const check = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return check.test(url);
}
export const errorCreator = (errors: ErrorMessagesType | undefined, name: string, youtubeUrl?: string) => {
  const baseErrorList = errors?.errorsMessages ? errors.errorsMessages : [];
  if (!name || name.length > 30) {
    errors = errorsMessagesCreator(baseErrorList,
      "Name must be present and contain corresponding quantity of characters",
      "name"
    );
  }
  if (typeof youtubeUrl === "string" && !isValidUrl(youtubeUrl)) {
    errors = errorsMessagesCreator(baseErrorList,
      "Youtube URL must be correctly formatted",
      "youtubeUrl");
  }
  return errors;
}