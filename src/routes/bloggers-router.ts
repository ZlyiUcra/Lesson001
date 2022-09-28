import {Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {
  bloggerForPostMiddleware, bloggersCorrectIdMiddleware,
  bloggersCorrectNameAndYoutubeURLUpdateMiddleware,
  bloggersNameAndYoutubeMiddleware
} from "../middlewares/bloggers/bloggersMiddleware";
import {postTitleShorDescriptionContentMiddleware} from "../middlewares/posts/postsMiddleware";
import {authAddUserDataFromTokenMiddleware} from "../middlewares/auth/authMiddleware";
import {rootContainer} from "../ioc/compositionRoot";
import {BloggersController} from "../controllers/bloggers-controller";

const bloggersController = rootContainer.resolve(BloggersController)

export const bloggersRouter = Router({});

bloggersRouter.get("/",
  bloggersController.getBloggers);

bloggersRouter.post("/",
  authBasicValidationMiddleware,
  bloggersNameAndYoutubeMiddleware,
  bloggersController.createBlogger.bind(bloggersController));

bloggersRouter.get('/:id',
  bloggersController.getBlogger);

bloggersRouter.put('/:id',
  authBasicValidationMiddleware,
  bloggersCorrectNameAndYoutubeURLUpdateMiddleware,
  bloggersCorrectIdMiddleware,
  bloggersController.updateBlogger.bind(bloggersController));

bloggersRouter.delete('/:id',
  authBasicValidationMiddleware,
  bloggersCorrectIdMiddleware,
  bloggersController.deleteBlogger);

bloggersRouter.get('/:bloggerId/posts',
  bloggerForPostMiddleware,
  authAddUserDataFromTokenMiddleware,
  bloggersController.getBloggerPosts.bind(bloggersController));

bloggersRouter.post("/:bloggerId/posts",
  authBasicValidationMiddleware,
  bloggerForPostMiddleware,
  postTitleShorDescriptionContentMiddleware,
  bloggersController.createBloggerPost.bind(bloggersController));