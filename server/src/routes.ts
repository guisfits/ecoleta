import express from "express";
import PointsController from "./controllers/points.controller";
import ItemsController from "./controllers/items.controller";
import { celebrate, Joi } from 'celebrate'

import multer from 'multer'
import multerConfig from './configs/multer'

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// * /items
routes.get("/items", itemsController.index);

// * /points
routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);
routes.post(
  "/points",
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
);

export default routes;
