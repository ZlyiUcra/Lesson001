import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {errorsMessagesCreator} from "../helpers/errorMessagesCreator";


export const bloggersRouter = Router({});

bloggersRouter.get("/", (req: Request, res: Response) => {
  const foundVideos = bloggersRepository.findAll();
  res.send(foundVideos);
});
bloggersRouter.post("/", (req: Request, res: Response) => {
  if (!req.body.name || req.body.name.length > 40) {
    const errorsMessages = errorsMessagesCreator([],
      "Name must be present and contain corresponding quantity of characters",
      "name"
    );
    res.status(400).send(errorsMessages);
    return;
  }
  const newBlogger = bloggersRepository.create(req.body.name, req.body.youtubeUrl);
  res.status(201).send(newBlogger);
});
bloggersRouter.get('/:id', (req: Request, res: Response) => {
  let blogger = bloggersRepository.findById(+req.params.id);
  if (blogger) {
    res.send(blogger)
    return;
  }
  res.status(404);
});
bloggersRouter.put('/:id', (req: Request, res: Response) => {
  let errors;
  if (!+req.params.id || isNaN(+req.params.id)) {
    errors = errorsMessagesCreator(
      [],
      "Video's id must be present",
      "id");
  }
  if (!req.body.name || req.body.name.length > 40) {
    errors = errorsMessagesCreator(errors?.errorsMessages ? errors.errorsMessages : [],
      "Name must be present and contain corresponding quantity of characters",
      "name");
  }
  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }

  const isUpdated = bloggersRepository.update(+req.params.id, req.body.name, req.body.youtubeUrl);
  if (isUpdated) {
    res.sendStatus(204);
    return;
  }
  res.sendStatus(404);
});
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
  const isDeleted = bloggersRepository.delete(+req.params.id);
  if (isDeleted) {
    res.sendStatus(204);
    return;
  }
    res.sendStatus(404);
})