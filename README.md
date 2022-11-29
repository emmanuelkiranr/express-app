# Express

Framework that helps us to easily handle all the routing, requests, server side logic and responces.

Firstly import express and create an server

```
import express from "express";
const app = express();

app.listen(3000);
```

listen to get request use .get method. - path to listen to and a callback fn

```
app.get("/", (req, res) => {
  res.send("<p>Hello from express app</p>");
});
```

Using send will automatically sets the content type based on the type of response we send, it also sets the satus code automatically

### Sending files

```
app.get("/about", (req, res) => {
  res.sendFile("./views/index.js"); -
});

This will give us an error: TypeError: path must be absolute or specify root to res.sendFile, so we need to specify the root
```

```
The dir we are currently in, now the root is express-app and from their the"./views/index is the relative path

app.get("/about", (req, res) => {
  res.sendFile("./views/index.html", { root: \_\_dirname });
});
```

### Redirects

express sends this response to the browser and forces it into a new request to /about and automatically sets status code to 304

```
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});
```

### 404 Page

use is to create and fire middleware functions in express, so this fn gets fired for every incoming requests, (not scoped out for any particular url), so we can use it for 404.

```
app.use((req, res) => {
  res.status(404).sendFile("./views/404.html", { root: __dirname });
  // since status returns a res obj we can chain it further
});
```

- use method is fired even if express finds a path match or not
- express runs through the methods from top to bottom until it finds a match,
- if found then express doesn't carry fwd with rest of the methods even there is other match as well like the use method (since its placed at last/ also try placing it at top)

## Sending dynamic html pages via view engines

Instead of creating renderTemplate and registerPartial function to render dynamic html pages we configure the app to use handlebars view engine.

`app.set` allows us to configure app settings - we are gonna configure the view engine setting, so the app knows which view engine to use ie handlebars.

```
app.set("view engine", "handlebars")
```

Express has a render fn that allows only execution of the libraries inside express, since handlebar is not in express we use express-handlebars. and we define the app's render engine.

```
import {engine} from "express-handlebars"

app.engine("handlebars", engine());
```

NOTE: Next we need a place to create different hbs views, automatically express and handlebars will look in the `views` folder, since that is the default value of where its gonna look. So if we want to overwrite this default property

```
app.set('views', path.join(__dirname, 'views')) - default

app.set("views", path.join(__dirname, "myViews)) - modified
```

Now to render an hbs file we use `res.render()`

### hbs path format

```
app.get("/", (req, res) => {
  res.render("index");
});

// path
views > (empty) -
Error: Failed to lookup view "index" in views directory "/Users/emmanuel/Documents/MERN/express-app/views"
```

So by default the render method looks in views directory so inside views we need to create the file to be rendered.

```
// path
views > "index.handlebars" -
Error: ENOENT: no such file or directory, open '/Users/emmanuel/Documents/MERN/express-app/views/layouts/main.handlebars
```

The main layout is the HTML page wrapper which can be reused for the different views of the app. {{{body}}} is used as a placeholder for where the main content should be rendered.

So we create a main.handlebars file inside a new dir layouts, This is the html layout/wrapper(empty body), we pass the body of different views/pages (login page, signup page) to the main.handlebars which takes this body and renders the entire html page.

Now if we res.render the index page we can see it (currently empty body).

Now start adding just the body part in `index.handlebars`.

So when we call the render fn on a file firstly ctrl goes to the layouts inside the views folder and takes the main.handlebars file and to it injects the body of the file which we gave to be rendered.

Also we can add components that need to be commonly rendered in all views like the navbar etc. inside partials

### Bootstrap

We can add the CDN links to css an js in the main.handlebars file and add the bootstrap properties to the body of different views.
Also we can download bootstrap and add it to a file named `static`. And add the links in the `main.handlebars`

```
<link rel="stylesheet" href="/static/lib/bootstrap/css/bootstrap.min.css">

<script type="text/javascript" src="/static/lib/bootstrap/js/bootstrap.bundle.min.js"></script>
```

Similar way we can also add normal css to hbs views. Add all the css files inside the static folder "create another file inside it named images to store the assets etc, and add the link to theses css styles to its corresponding hbs file
