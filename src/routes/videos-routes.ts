import {Request, Response, Router} from "express";
import {errorsMessagesCreator} from "../helpers/errorMessagesCreator";
import {blacklistValidationMiddleware} from "../middlewares/blacklistValidaionMiddleware";
import {videosRepository} from "../repositories/videos-repository";
import {jsonValidationMiddleware} from "../middlewares/jsonValidationMiddleware";
import {body, validationResult} from "express-validator";
import {inputValidationMiddleware, titleValidator} from "../middlewares/inputValidationMiddleware";


export const videosRouter = Router({});


videosRouter.get("/", /*blacklistValidationMiddleware,*/ (req: Request, res: Response) => {
  const foundVideos = videosRepository.findVideos();
  res.send(foundVideos)
});
videosRouter.post("/", jsonValidationMiddleware, (req: Request, res: Response) => {
  if (!req.body.title || req.body.title.length > 40) {
    const errorsMessages = errorsMessagesCreator([],
      "Title must be present and not empty",
      "title");
    res.status(400).send(errorsMessages);
    return;
  }
  const newVideo = videosRepository.createVideo(req.body.title, req.body.author);
  res.status(201).send(newVideo);
});
videosRouter.get('/:id', (req: Request, res: Response) => {
  let video = videosRepository.findVideoById(+req.params.id);
  if (video) {
    res.send(video);
  } else {
    res.send(404);
  }
});
videosRouter.put('/:id',
  titleValidator,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    // //express-validator functionality
    // const errorsExpressValidator = validationResult(req);
    // if (!errorsExpressValidator.isEmpty()) {
    //   return res.status(400).json({errors: errorsExpressValidator.array()});
    // }
    let errors;
    if (!+req.params.id || isNaN(+req.params.id)) {
      errors = errorsMessagesCreator(
        [],
        "Video's id must be present",
        "id");
    }
    if (!req.body.title || req.body.title.length > 40) {
      errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
        "Title must be present and not empty",
        "title");
    }
    if (errors?.errorsMessages?.length) {
      res.status(400).send(errors);
      return;
    }

    const isUpdated = videosRepository.updateVideo(+req.params.id, req.body.title, req.body.author);
    if (isUpdated) {
      //const video = videosRepository.findVideoById(+req.params.id);
      res.sendStatus(204);
    }
    res.sendStatus(404);

  });
videosRouter.delete('/:id', (req: Request, res: Response) => {
  const isDeletedVideo = videosRepository.deleteVideo(+req.params.id);
  if (isDeletedVideo) {
    res.sendStatus(204);
  }
  res.sendStatus(404);
});