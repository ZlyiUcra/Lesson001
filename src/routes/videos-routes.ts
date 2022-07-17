import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/videos-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";

export const videosRouter = Router({});

const titleValidation = body('title').trim()
  .withMessage('Title must be present and not empty.');

videosRouter.get("/", (req: Request, res: Response) => {
  const foundVideos = videosRepository.findVideos();
  res.status(200).send(foundVideos);

});
videosRouter.post("/",
  titleValidation,
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const newVideo = videosRepository.createVideo(req.body.title, req.body.author);
    res.status(201).send(newVideo);
  }
);
videosRouter.get('/:id', (req: Request, res: Response) => {
  let video = videosRepository.findVideoById(+req.params.id);
  if (video) {
    res.send(video);
  } else {
    res.send(404);
  }
});
videosRouter.put('/:id',
  titleValidation,
  inputValidationMiddleware,
  (req: Request, res: Response) => {


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