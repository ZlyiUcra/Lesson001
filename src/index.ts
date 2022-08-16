import express, {Request, Response} from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import {addressesRouter} from "./routes/addresses-router";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./db/db";
import {authRouter} from './routes/auth-router';
import {settings} from "./settings";
import {usersRouter} from './routes/users-router';
import {commentsRouter} from "./routes/comments-routes";
import {testingRouter} from './routes/testing-router';

const app = express();

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
app.use('/addresses', addressesRouter);
app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

const startApp = async () => {
  await runDb();
  app.listen(settings.PORT, () => {
    console.log(`Example app listening on port ${settings.PORT}`);
  });
}

startApp()