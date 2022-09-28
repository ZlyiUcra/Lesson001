import "reflect-metadata";
import {Router} from "express";
import {rootContainer} from "../ioc/compositionRoot";
import {TestingController} from "../controllers/testing-controller";

const testingController = rootContainer.resolve(TestingController);

export const testingRouter = Router({});

testingRouter.delete('/all-data',
  testingController.allData.bind(testingController))