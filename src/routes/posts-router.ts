import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {ErrorMessagesType, errorsMessagesCreator} from "../helpers/errorMessagesCreator";
import {postsErrorCreator} from "../helpers/postsHelpers";
import {authValidationMiddleware} from "../middlewares/authValidationMiddleware";
import {PostPaginatorInput} from "../db/types";
import {bloggersService} from "../domain/bloggers-services";
import {postsService} from "../domain/posts-services";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
  const searchPostsTerm: PostPaginatorInput = {
    pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
    pageSize: +(req.query.PageSize ? req.query.PageSize : 0)
  }
  const posts = await postsService.findAll(searchPostsTerm);
  res.send(posts);
});
postsRouter.post('/', authValidationMiddleware, async (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = postsErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, +req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }
  const newPost = await postsService.create(req.body.title,
    req.body.shortDescription,
    req.body.content,
    +req.body.bloggerId);
  res.status(201).send(newPost);
});
postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postsService.findById(+req.params.id);
  if (post) {
    res.send(post);
    return;
  }
  res.status(404).send();
});
postsRouter.put('/:id', authValidationMiddleware, async (req: Request, res: Response) => {
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
  const isUpdated = await postsService.update(+req.params.id, req.body.title,
    req.body.shortDescription, req.body.content, +req.body.bloggerId);

  if (isUpdated) {
    res.status(204).send();
    return;
  }
  res.status(404).send();

});
postsRouter.delete('/:id', authValidationMiddleware,
  async (req: Request, res: Response) => {
  const isDeleted = await postsService.delete(+req.params.id);
  if (isDeleted) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});