# Express

Framework that helps us to easily handle all the routing, requests, server side logic and responces.

Firstly import express and create an server

```
import express from "express";
const app = express();

app.listen(3000);
```

listen to get request using "get" method- Takes 2 params - path to listen to and a callback fn

```
app.get("/", (req, res) => {
  res.send("<p>Hello from express app</p>");
});
```

Using "send" will automatically sets the content type based on the type of response we send, and the satus code

### Sending files

```
app.get("/about", (req, res) => {
  res.sendFile("./views_basic/index.html"); -
});

This will give us an error: TypeError: path must be absolute or specify root to res.sendFile, so we need to specify the root
```

```
The dir we are currently in, now the root is express-app and from their the"./views/index is the relative path

app.get("/about", (req, res) => {
  res.sendFile("./views_basic/index.html", { root: __dirname });
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
  res.status(404).sendFile("./views_basic/404.html", { root: __dirname });
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

NOTE: Next we need a place to create different hbs views, automatically express and handlebars will look in the `views` folder, since that is the default value. So if we want to overwrite this default property:

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

The main layout is a HTML page wrapper which can be reused for the different views of the app. {{{body}}} is used as a placeholder for where the content should be rendered.

So we create a main.handlebars file inside a new dir layouts, This is the html layout/wrapper(empty body), we pass the content of different views/pages (login page, signup page) to the main.handlebars layout which takes this content and puts them in the {{{body}}} section and renders the entire html page.

Now if we res.render the index page we can see it (currently empty body).

Now start adding just the body part in `index.handlebars`.

So when we call the render fn on a file firstly ctrl goes to the layouts inside the views folder and takes the main.handlebars file and to it injects the content/body of the file which we gave to be rendered.

Also we can add components that need to be commonly rendered in all views like the navbar etc. inside partials and call them in the main.handlebars using {{>navbar}}

### Bootstrap

We can add the CDN links to css an js in the main.handlebars file and add the bootstrap properties to the body of different views.

Note - Below methods are achieved using middleware [check static files below]
Also we can download bootstrap and add it to a file named `static`. And add the links in the `main.handlebars`

```
<link rel="stylesheet" href="/static/lib/bootstrap/css/bootstrap.min.css">

<script type="text/javascript" src="/static/lib/bootstrap/js/bootstrap.bundle.min.js"></script>
```

Similar way we can also add normal css to hbs views. Add all the css files inside the static folder "create another file inside it named images to store the assets etc, and add the link to theses css styles to its corresponding hbs file

## Passing data into views

we can pass values as an object while we call the render method.

```
// In router

app.get("/", (req, res) => {
  res.render("index", { title: "This is the home page", data: "emmanuelkiranr" });
});

// In views
<title>{{title}}</title>
<h1 class="text-center">{{data}}</h1>
```

Passing an array of objects

```
app.get("/", (req, res) => {
  const blog = [
    { name: "Blog 1", description: "lorem ipsum" },
    { name: "Blog 2", description: "lorem ipsum" },
    { name: "Blog 3", description: "lorem ipsum" },
  ];
  res.render("index", { title: "This is the home page", data: blog });
});
```

```
<div class="container">
    {{#each data}}
    <h3>{{this.name}}</h3>
    <p>{{this.description}}</p>
    {{/each}}
</div>
```

## Middleware

- Code which runs on the server between getting a request and sending a response. We can have multiple middleware run on the server.
- The "get" and "post" methods are also kind of middleware by definition. But the "use" method fires for all kind of request no matter if it's get and post
- The code executes top to bottom, until we exit the process or explicitely send response to the browser. So the order of middleware is important

  - logger middleware to log details of every request
  - authenticaton check mw for protected routes
  - MW to parse json data send from post requests
  - return 404 pages
  - 3rd parth mw for logging, session, cookies, etc, eg `npm i morgan` -> `app.use(morgan("dev"));`
  - some mw comes with express for serving static css files

### Logger middleware

```
app.use((req, res) => {
  console.log("New request made");
  console.log(req.path);
  console.log(req.hostname);
  console.log(req.method);
});
```

At this point the site hangs cause after executing the mw we are not sending any response, express doesn't know what to do next so we use the next method. `next()` - used to tell move on with the next mw
We get access to this fn from the mw fn parameter, we just have to invoke it.

We can have multiple mw one after other, the execution will stop only if we send some response.

## static file

If we have static files like styles, img etc, we won't be able to access them automatically. Cause the server protects all of our files from users in the browser so they cant access any of our files.
So we have to specify what files should be accessed ie public, to achieve this we use the `static` middleware that comes with express

```
app.use(express.static("static"));

in html views - href="/styles.css" - not static/styles/css
```

So if we create a file named static, that would be accessiable by the browser try: `localhost:3000/styles.css

<!-- Continue with the tutorial -->

## Requests

GET, POST, DELETE, PUT

We can have multiple requests to same url if the method type is different, ie get req and post req are handled differently on the server

## Express router and controllers

learn more from [here](https://github.com/emmanuelkiranr/sequelize)

Express router - Comes with express and helps us in managing all of our routes efficently. Currently we have all our routes and it's login in one file. We use express router to split our routes into different files and manage them in small group of routes that belong together, it makes our app modular and easy to update the paths of the app later on.

Controllers - Its the link between our models and views, it uses model to get data and pass it to the view (controller gets data from models.js and renders the view using res.render) - similar to routes but more fine grained ctrl.
In controller there should be only 4 actions - Create, Read, Update and Delete

The route file matches incoming requests and it matches those req to the correct controller fn, the controller communicates with the approproate model to get data into the view, the view then renders the data into its template and it gets send to the browser

## Movie MVC app

<!-- Models -->

step - 1: config sequelize/create an instance of sequelize in the db_handler.js. Once initialized create a new database.
step - 2: Define the model. (In models.js file).
step - 3: Now sync the models by exporting them to sync.js [order of sync is important].

<!-- Controllers -->

step - 4: Now start creating the controllers, accountController for login and register, movieController for CRUD movie.
Each controller will have the CURD fns, where each fn rendering a view as output(res.render()).

<!-- Routes -->

step - 5: Create a route to access the fns in the controller using express-router. We have separate routes for each controller, accountRoutes for accountController & movieRoutes for movieController.

Import the controllers to their corresponding routes and route to the fns based on the request method and path.
For delete and update routes, we'll have the id as well in the path.

## NOTE: Create the express-route just after the fn for it is defined in the controller, then move on to create the view for that particular route. ie define a fn in the controller -> create a route for it -> create the view, then move on to create the next function -> route -> view and so on.

<!-- Views -->

step - 6: Create the view for the file that is to be renderd via that particular route.

<!-- Create the express app -->

step - 7: Finally create the express app, and import all the routes to this app. Using middleware access these routes.

NOTE:

When using `res.redirect("/")` - the browser sends a new request to the server - so we need to create a route to handle this new request as well(if redirecting to a new page) - `router.get("/", movieController.index);`

For update we use the url `/update/:id` - here the :id refers to the id we pass via the url - this id is not passed as an object format but just the value itself so to get this value in object format we use the `req.params` - `req.params.id`

To get the current details (before updating) inside a form format for better viewability. Render the current format in a form and display each values in the appropriate tags by passing to it an data object, and accessing it via the dataValues prop inside the value attribute.

```
<div>
  <label for="releasedate">Release Date</label>
  <input type="date" name="releasedate id="releasedate" class="form-control" value="{{data.dataValues.releaseDate}}">
</div>
```

This allows us to directly update the required data from inside the form itself and save to the db via the updatePost request.
The form contains the id (`req.params`), and the new values are taken from the `req.body` once we start updating and submit the form (post method)

Delete - before deleting we need to check whether that entry exists in the db

```
const _delete = async (req, res) => {
  let id = req.params.id;
  let exists = await Movie.findByPk(id);
  // Since this returns a promise, this is an async function,
  // so we have to finish executing this first inorder to delete the data only after verifying. Or else the deletion takes place before this check
  if (exists != null) {
    Movie.destroy({
      where: {
        id,
      },
    });
    res.json({ data: "Successfully deleted" });
  } else {
    res.json({ data: "Data doesn't exist" });
  }
};
```
