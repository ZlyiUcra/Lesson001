import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {videosRouter} from "./routes/videos-routes";

const app = express();
const port = process.env.PORT || 3000;


const parserMiddleware = bodyParser({});
app.use(parserMiddleware);

app.get('/', (req: Request, res: Response) => {
  const helloMessage = 'Hello Incubator.EU??';
  res.send(helloMessage)
});

app.use('/products', productsRouter);
app.use('/addresses', addressesRouter);
app.use('/videos', videosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});