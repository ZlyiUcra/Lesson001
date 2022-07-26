import {Request, Response, Router} from "express";
import { productsService } from "../domain/products-service";
// import {productsRepository} from "../repositories/products-repository";
// import {body} from "express-validator";
// import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
//
//
// export const productsRouter = Router({});
//
// const titleValidation = body('title').trim()
//   .isLength({min: 3, max: 10})
//   .withMessage('Title length should be from 3 to 10 symbols.');
//
// productsRouter.get('/', (req: Request, res: Response) => {
//   const foundProducts = productsRepository.getAll();
//   res.send(foundProducts);
// });
// productsRouter.post('/',
//   titleValidation,
//   inputValidationMiddleware,
//   (req: Request, res: Response) => {
//
//     const newProduct = productsRepository.create(req.body.title);
//     res.status(201).send(newProduct);
//   });
// productsRouter.get('/:id', (req: Request, res: Response) => {
//   let product = productsRepository.findProductById(+req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.send(404);
//   }
// });
// productsRouter.put('/:id',
//   titleValidation,
//   inputValidationMiddleware,
//   (req: Request, res: Response) => {
//
//     const isUpdated = productsRepository.updateProduct(+req.params.id, req.body.title);
//     if (isUpdated) {
//       const product = productsRepository.findProductById(+req.params.id);
//       res.send(product);
//     }
//     res.sendStatus(404);
//   });
//
// productsRouter.delete('/:id', (req: Request, res: Response) => {
//   const isDeletedProduct = productsRepository.deleteProduct(+req.params.id);
//   if (isDeletedProduct) {
//     res.sendStatus(204);
//   }
//   res.sendStatus(404);
// });

import {productsRepository} from "../repositories/products-repository";

export const  productsRouter = Router({})

productsRouter.post('/',
  async (req: Request<{}, {}, { title: string }>, res: Response) => {
    const product = await productsService.create(req.body.title)

    res.status(201).send(product)
  })

productsRouter.put('/:id',
  async (req: Request<{ id: string }, { title: string }>, res: Response) => {
    const isUpdated = await productsService.update(req.params.id, req.body.title)
    if (isUpdated) {
      const product = await productsService.getById(req.params.id);
      res.send(product)
    } else {
      res.send(404)
    }
  })

productsRouter.get('/', async (req: Request, res: Response) => {
  const products = await productsService.getAll()

  res.send(products)
})

productsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  let product = await productsService.getById(req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.send(404)
  }
})

productsRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await productsService.delete(req.params.id)
  if (isDeleted) {
    res.send(204)
  } else {
    res.send(404)
  }
})
