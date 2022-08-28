import express, {Request, Response} from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./db/db";
import {authRouter} from './routes/auth-router';
import {settings} from "./settings";
import {usersRouter} from './routes/users-router';
import {commentsRouter} from "./routes/comments-routes";
import {testingRouter} from './routes/testing-router';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use(cors());

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);

app.get('/', (req: Request, res: Response) => {
  const helloMessage = 'Hello Incubator.EU??';
  res.send(helloMessage)
});

app.use('/testing', testingRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

const startApp = async () => {
  await runDb();
  app.listen(settings.PORT, () => {
    console.log(`Example app listening on port ${settings.PORT}`);
  });
}

startApp()