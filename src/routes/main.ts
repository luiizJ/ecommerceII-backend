import { Router } from "express";
import * as bannerController from "../controllers/banner";
import * as productsController from "../controllers/products";

export const routes = Router();

routes.get("/ping", (req, res) => {
  res.json({ pong: true });
});

routes.get("/banners", bannerController.getBanners);

routes.get("/products", productsController.getProducts);
