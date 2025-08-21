import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { routes } from "./routes/main.js";

const server = express();
server.use(cors());
server.use(express.static("public"));
server.use(express.json());

server.use(routes);
server.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    response.status(500).json({ error: "Ops, Parece que algo deu errado" });
  }
);
server.listen(4000, () => {
  console.log("running");
});
