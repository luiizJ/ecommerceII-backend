import type { RequestHandler } from "express";
import { GetProductSchema } from "../schemas/get-product-schema";
import { getAllProducts } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";

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
