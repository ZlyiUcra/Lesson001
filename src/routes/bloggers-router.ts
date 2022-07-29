import {Request, Response, Router} from "express";
//import {bloggersRepository} from "../repositories/bloggers-repository";
import {ErrorMessagesType, errorsMessagesCreator} from "../helpers/errorMessagesCreator";
import {bloggerErrorCreator} from "../helpers/bloggersHelpers";
import {authValidationMiddleware} from "../middlewares/authValidationMiddleware";
import {bloggersService} from "../domain/bloggers-services";
import {BloggerPaginatorInput} from "../db/types";


export const bloggersRouter = Router({});

bloggersRouter.get("/", async (req: Request, res: Response) => {

  const searchBloggersTerm: BloggerPaginatorInput = {
    searchNameTerm: req.query.SearchNameTerm ? req.query.SearchNameTerm as string : '',
    pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
    pageSize: +(req.query.PageSize ? req.query.PageSize : 0)
  }

  const bloggers = await bloggersService.findAll(searchBloggersTerm);
  res.send(bloggers);
});

bloggersRouter.post("/", authValidationMiddleware, async (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = bloggerErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }
  const newBlogger = await bloggersService.create(req.body.name, req.body.youtubeUrl);
  res.status(201).send(newBlogger);
});

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
  let blogger = await bloggersService.findById(+req.params.id);
  if (blogger) {
    res.status(200).send(blogger);
    return;
  }
  res.status(404).send();
});

bloggersRouter.put('/:id', authValidationMiddleware, async (req: Request, res: Response) => {
  let errors: ErrorMessagesType | undefined;
  if (!+req.params.id || isNaN(+req.params.id)) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect blogger's Id",
      "id");
  }
  errors = bloggerErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  }

  const isUpdated = await bloggersService.update(+req.params.id, req.body.name, req.body.youtubeUrl);
  if (isUpdated) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});

bloggersRouter.delete('/:id', authValidationMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await bloggersService.delete(+req.params.id);
  if (isDeleted) {
    res.status(204).send();
    return;
  }
  res.status(404).send();
});