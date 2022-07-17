import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {ErrorMessagesType, errorsMessagesCreator} from "../helpers/errorMessagesCreator";
import {errorCreator} from "../helpers/bloggersHelpers";


export const bloggersRouter = Router({});


bloggersRouter.get("/", (req: Request, res: Response) => {
  const foundVideos = bloggersRepository.findAll();
  res.send(foundVideos);
});
bloggersRouter.post("/", (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = errorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }
  const newBlogger = bloggersRepository.create(req.body.name, req.body.youtubeUrl);
  res.status(201).send(newBlogger);
});
bloggersRouter.get('/:id', (req: Request, res: Response) => {
  let blogger = bloggersRepository.findById(+req.params.id);
  if (blogger) {
    res.send(blogger);
    return;
  }
  res.status(404).send();
});
bloggersRouter.put('/:id', (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined;
  if (!+req.params.id || isNaN(+req.params.id)) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect blogger's Id",
      "id");
  }
  errors = errorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }

  const isUpdated = bloggersRepository.update(+req.params.id, req.body.name, req.body.youtubeUrl);
  if (isUpdated) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
  const isDeleted = bloggersRepository.delete(+req.params.id);
  if (isDeleted) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});