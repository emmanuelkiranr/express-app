import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { engine } from "express-handlebars";
import parser from "body-parser";
import cookieSession from "cookie-session";
import authMiddleware from "./middlewares/authMiddleware.js";
import createHttpError from "http-errors";

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.listen(80);

app.use(
  cookieSession({
    name: "session",
    httpOnly: true,
    keys: ["asdghjhgsdahjsgdhjasd"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(authMiddleware);

app.use("/", parser.urlencoded({ extended: true }));
app.use(movieRoutes);
app.use(accountRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "File not found"));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err);
  let status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("error");
});
