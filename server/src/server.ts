import express from "express";
import routes from "./routes";
import path from "path";
import cors from "cors";
import { errors } from 'celebrate'

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/public", express.static(path.resolve(__dirname, "..", "public", "images")));

app.use(errors());

app.listen(3333);
