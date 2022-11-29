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

// logger mw
app.use((req, res, next) => {
  console.log("New request made");
  console.log(req.path);
  console.log(req.hostname);
  console.log(req.method);
  next();
});

app.get("/", (req, res) => {
  const blog = [
    { name: "Blog 1", description: "lorem ipsum" },
    { name: "Blog 2", description: "lorem ipsum" },
    { name: "Blog 3", description: "lorem ipsum" },
  ];
  res.render("index", { title: "This is the home page", data: blog });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "This is the Home Page" });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Oops page not found" });
});

app.listen(3000);
