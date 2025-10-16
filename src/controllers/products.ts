import type { RequestHandler } from "express";
import { GetProductSchema } from "../schemas/get-product-schema";
import {
  getAllProducts,
  getProduct,
  incrementProductViews,
} from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";
import { GetOneProductSchema } from "../schemas/get-one-product-schema";
import { getCategory } from "../services/category";

export const getProducts: RequestHandler = async (req, res, next) => {
  const parseResult = GetProductSchema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "Parametros invalidos" });
    return;
  }
  const { metadata, orderBy, limit } = parseResult.data;

  const parsedLimit = limit ? parseInt(limit) : undefined;
  const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;

  const products = await getAllProducts({
    metadata: parsedMetadata,
    orderBy,
    limit: parsedLimit,
  });
  const productsWithAbsoluteUrl = products.map((product) => ({
    ...product,
    image: product.images ? getAbsoluteImageUrl(product.images[0]) : null,
    liked: false, // todo: once have like funcionallity, fetch this
  }));
  res.json({ error: null, products: productsWithAbsoluteUrl });
};

export const getOneProduct: RequestHandler = async (req, res, next) => {
  const paramsResult = GetOneProductSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: "Parametros invalidos" });
    return;
  }
  const { id } = paramsResult.data;
  //produto
  const product = await getProduct(parseInt(id));
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }
  const productWithAbsoluteImages = {
    ...product,
    image: product.images.map((image) => getAbsoluteImageUrl(image)),
  };
  //categoria
  const category = await getCategory(product.categoryId);
  if (!category) {
    res.status(404).json({ error: "Categoria não encontrada" });
    return;
  }
  //incrementar views
  await incrementProductViews(parseInt(id));
  //retornar produto
  res.json({
    error: null,
    product: productWithAbsoluteImages,
    category,
  });
};
