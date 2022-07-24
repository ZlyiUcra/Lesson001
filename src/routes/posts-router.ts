import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {ErrorMessagesType, errorsMessagesCreator} from "../helpers/errorMessagesCreator";
import {postsErrorCreator} from "../helpers/postsHelpers";
import {authValidationMiddleware} from "../middlewares/authValidationMiddleware";

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {
  const foundPosts = postsRepository.findAll();
  res.send(foundPosts);
});
postsRouter.post('/', authValidationMiddleware, (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = postsErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, +req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }
  const newPost = postsRepository.create(req.body.title,
    req.body.shortDescription,
    req.body.content,
    +req.body.bloggerId);
  res.status(201).send(newPost);
});
postsRouter.get('/:id', (req: Request, res: Response) => {
  const post = postsRepository.findById(+req.params.id);
  if (post) {
    res.send(post);
    return;
  }
  res.status(404).send();
});
postsRouter.put('/:id', authValidationMiddleware, (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined;
  if (!+req.params.id || isNaN(+req.params.id)) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect post's Id",
      "id");
  }
  ;
  errors = postsErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, +req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }
  const isUpdated = postsRepository.update(+req.params.id, req.body.title,
    req.body.shortDescription, req.body.content, +req.body.bloggerId);

  if (isUpdated) {
    res.status(204).send();
    return;
  }
  res.status(404).send();

});
postsRouter.delete('/:id', authValidationMiddleware, (req: Request, res: Response) => {
  const isDeleted = postsRepository.delete(+req.params.id);
  if (isDeleted) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});