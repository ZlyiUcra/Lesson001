import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {videosRouter} from "./routes/videos-routes";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {counterMiddleware} from "./middlewares/counterMiddleware";

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);
app.use(counterMiddleware);

app.get('/', (req: Request, res: Response) => {
  const helloMessage = 'Hello Incubator.EU??';
  res.send(helloMessage)
});

app.use('/products', productsRouter);
app.use('/addresses', addressesRouter);
app.use('/videos', videosRouter);
app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});