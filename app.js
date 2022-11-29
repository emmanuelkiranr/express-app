import express from "express";
import { engine } from "express-handlebars";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuring the express app to use handlebars template engine.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.sendFile("./views/about.html", { root: __dirname });
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.use((req, res) => {
  res.status(404).sendFile("./views/404.html", { root: __dirname });
});

app.listen(3000);
