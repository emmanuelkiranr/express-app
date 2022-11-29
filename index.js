import express from "express";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
  res.sendFile("./views_basic/index.html", { root: __dirname });
});

app.get("/about", (req, res) => {
  res.sendFile("./views_basic/about.html", { root: __dirname });
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.use((req, res) => {
  res.status(404).sendFile("./views_basic/404.html", { root: __dirname });
});

app.listen(3000);
