import {Request, Response, Router} from "express";
import {errorMessagesCreator} from "../helpers/errorMessagesCreator";
import {videosRepository} from "../repositories/videos-repository";
import {productsRepository} from "../repositories/products-repository";


export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  const foundVideos = videosRepository.findVideos();
  res.send(foundVideos)
});
videosRouter.post("/", (req: Request, res: Response) => {
    if (!req.body.title) {
      const errorsMessages = errorMessagesCreator([],
        "Title must be present and not empty",
        "title");
      res.status(400).send(errorsMessages);
      return;
    }
    const newVideo = videosRepository.createVideo(req.body.title, req.body.author);
    res.status(201).send(newVideo);
  }
)
;
videosRouter.get('/:id', (req: Request, res: Response) => {
  let video = videosRepository.findVideoById(+req.params.id);
  if (video) {
    res.send(video);
  } else {
    res.send(404);
  }
});
videosRouter.put('/:id', (req: Request, res: Response) => {
  let errors;

  if(!+req.params.id || isNaN(+req.params.id)){
    errors = errorMessagesCreator(
      [],
      "Video's id must be present",
      "id");
  }
  if(!req.body.title){
    errors = errorMessagesCreator(errors?.errorMessages ? errors.errorMessages : [],
      "Title must be present and not empty",
      "title");
  }
  if(errors?.errorMessages?.length){
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