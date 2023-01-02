import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { engine } from "express-handlebars";
import parser from "body-parser";

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.listen(80);

app.use("/", parser.urlencoded({ extended: true }));
app.use(movieRoutes);
app.use(accountRoutes);
