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

## response methods

```
res.json()

res.send() - strings

res.download() - Transfers/downloads the file as an attachment

res.redirect() - Redirects the user to the specified route by forcing another request to an extrernal site or within the app
```

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

Functions that have access to the request object, the response object, and the next function in the application’s request-response cycle.

- Code which runs on the server between getting a request and sending a response. We can have multiple middleware run on the server.
- The "get" and "post" methods are also kind of middleware by definition. But the "use" method fires for all kind of request no matter if it's get and post
- The code executes top to bottom, until we exit the process or explicitely send response to the browser. So the order of middleware is important

In-built middleware

```
express.static(); - serve static files
express.json(); - parse incoming req with json payloads
express.urlencoded(); - parse incoming req with URL encoded payloads
```

- logger middleware to log details of every request
- authenticaton check mw for protected routes
- MW to parse json data send from post requests
- return 404 pages
- 3rd parth mw for logging, session, cookies, etc, eg `npm i morgan` -> `app.use(morgan("dev"));`
- some mw comes with express for serving static css files

```
app.use("/", (req, res, next) => {

  next(); - To invoke the next middleware fn in the app
})
```

Multiple callbacks

```
app.get("/next" , (req, res, next) => {}, (req, res) => {})

app.get(
  "/next",
  (req, res, next) => {
    console.log("The next middleware will send the response");
    next();
  },
  (req, res) => {
    res.send("Just set up a route with second callback");
  }
);
```

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

## Utilizing middlewares for errors

We can end an request cycle by sending a response or call the next middleware in the chain using next(), but if any error occurs inside the middleware or route, it might crash our application

To simulate this create a route or middleware and manually throw an error from our app - `throw new Error();`

```
// In  movieRoutes.js

router.get("/throw", (req, res) => {
  throw new Error(); // stack trace in browser
});
```

This won't crash the app, but if most times we are using async fns, so if we throw an error inside an async invocation it would crash our app,
To simulate this use setTimeout;

```
router.get("/throw", (req, res) => {
  setTimeout(() => {
    throw new Error();
  }, 2000);
});
```

This will crash the app after 2 seconds without any error to the client and give the default error message to the client. Since most of the controllers are written in a async function it is important to handle these errors properly to avoid the app from crashing.

To handle these errors from async fns: use next(); to directly return the err object instead of throw

```
router.get("/throw", (req, res, next) => {
  setTimeout(() => {
    // *note
    return next(new Error()); // short stack trace msg in browser cause in async nodejs doesn't see much of what happend before
  }, 2000);
});

```

This won't crash the app, but since we mostly use async await to write fns if we throw errors there:

```
const getName = async () => {
  throw new Error();
  return "Emmanuel";
};
router.get("/throw", async (req, res, next) => {
  let data = await getName();
  return data;
});
```

This would completely crash the app [unhandled promise rejection warning].

To handle this and the async invocation properly use the `try catch block`. So if any error occurs in the try block it is caught and handled in the catch block.

```
const getName = async () => {
  throw new Error();
  return "Emmanuel";
};
router.get("/throw", async (req, res, next) => {
  try {
    let data = await getName();
    return data;
  } catch (err) {
    // *note
    return next(err); // stack trace error in the browser
  }
});
```

This won't crash our application.

Now we need to remove the stack trace error from the browser since the client doesn't want to see it an it might contain any sensitive info.

create an error template to display when the app throws an error,
[NOTE: We need to handle errors thrown by the routes/controllers and also for 404, for 404 create an additional middleware at the end (since they are executed in order)]

### Error handling middleware

```
app.use((err, req, res, next) => {
  console.error(err.stack); - displays the err stack only for the dev
  res.status(500).send("Internal server Error");
});
```

Error handling middleware with error template

NOTE \* - Remove the return once we have the error handling middleware, since we need to call next() on the err, only then the error will be passed to the error handler middleware.

```
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err);
  let status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("error");
});
```

This will handle all errors that is being formed from any routes/controller.

locals is an object which is a property of the req object, this is used to store values to variables scoped to that particular request in which it is used, because of this, it is only availabel to the view(s) rendered during that request/response cycle.

eg:

```
const getName = async () => {
  return "Emmanuel";
};
router.get("/throw", async (req, res, next) => {
  try {
    throw new Error("Internal server errror"); // we get an error from a route inside the try block
    let data = await getName();
    return data;
  } catch (err) {
    next(err); // catches the error and passes it to the error handling middleware since it has the err parameter
  }
});

The middleware handles the error and renders the error page
```

Now to handle 404 File not found errors create another middlewares

```
app.use((req, res, next) => {
  return next(createHttpError(404, "File not found")); // return not necessary
});
```

Since we need to send the error to error handling middleware as next(err); format, to make the 404 error into similar format we use the `http-errors` pkg. and `import createHttpError from "http-errors"`;
Now we can pass to it the status and error message

## static file

If we have static files like styles, img etc, we won't be able to access them automatically. Cause the server protects all of our files from users in the browser so they cant access any of our files.
So we have to specify what files should be accessed ie public, to achieve this we use the `static` middleware that comes with express. This allows us to access those files at root level

```
app.use(express.static("static"));

in html views - href="/styles.css" - not static/styles/css - since we now have access to static at root level
```

So if we create a file named static, that would be accessiable by the browser try: `localhost:3000/styles.css.

To create a specific route for the static files `app.use("/images", express.static("images"));`

## Requests

GET, POST, DELETE, PUT

We can have multiple requests to same url if the method type is different, ie get req and post req are handled differently on the server

### Route Chaining to handle requests to same url

```
app.route("/path").get((req, res) => {
  res.send("Read class info");
}).post((req, res) => {
  res.send("Create class info");
}).put((req, res) => {
  res.send("Update class info");
}).delete((req, res) => {
  res.send("Delete class info");
});
```

## Express router and controllers

learn more from [here](https://github.com/emmanuelkiranr/sequelize)

ROUTES: To determine how an application responds to a client request to a particular endpoint, which is a path and an request method [HTTP method - actions taken on a specific resource often CRUD].

Route handler - Blocks of code that handle the logic for the routes, in the form of functions.

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

Route parameters (params - req.params): Segments of an URL that are used to capture values specified at positions within the URL.
eg `app.get("/users/:userId/books/:bookId, () => {})`
`req.params` returns an object with key: value pair corresponding to the route parameters and their values.
NOTE: The value is always returned as strings

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

Added option to add, edit, delete each entry directly from the index page for easier navigation [code](https://github.com/emmanuelkiranr/express-app/blob/main/views/index.handlebars)

## cookie-session

Since http is stateless ie it does not recognize user/data between requests. So to persist data b/w request we need sessions.
With the help of sessions we can store data in the request header that will be send to the server everytime the client sends a new request. This way data persists b/w requests.

This is useful when we want to authenticate users, once the user login we'll store their info in the session object and then sent the response to the client, this response will contain those info writing to the request header.

To store info in the request header, we need to create another object in req called session. Then we just need to add the details that need to persist into this.

```
Once req passes throuth this middleware, it will contain another property named session

app.use(
  cookieSession({
    name: "session",
    httpOnly: true,
    keys: ["asdghjhgsdahjsgdhjasd"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
```

[req is an object with many properties to it we are adding session as well, this session is an object by itself with properties like userId for auth, viewCount for no. of visits etc.]

This will create a new cookie session middleware with the provided options. This middleware will attach the property session to req, which provides an object representing the loaded session. This session is either a new session if no valid session was provided in the request, or a loaded session from the request.

If we don't set the maxAge the cookie will be deleted when we close the browser;
secure - cookie will only be sent over secure connection means SSL

## storing userId to the session object

Once we authenticate a user through login, we need to make sure that we recognise them later(when they send req to another page), ie if the next request is send by the authenticated user or not, or else we have to reauthenticate them again for each requests.

so we create a middleware for this, when the user first login we retreve their userId from the database and store it to the session object[created above] and then set it to the req header when we send response.

`cookie-session` will create the sesssion object in req header

Once we authenticate the users after verifying their records from the database, we take their userId and store it to session by `req.session.userId = login.id`. The data stored in session is encrypted for the client. [eventhough encrypted it can be found by decrypting it so use some kind of random hash that cannot be easily brute forced]. Also storing the entire User details in the session would mean if we delete that user from the db, it's data is still available in the session. So just userId is enough as it allows us to access that user from db.

```
const loginPost = async (req, res) => {
  let login = await Users.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  });
  if (login == null) {
    return res.render("login", { data: "User doesn't exist" });
  }
  req.session.userId = login.id; <----
  res.redirect("/");
};
```

From now on the request send by the client will contain the session object with the userId property;

## authMiddleware

Now when the client makes a new request to any pages, we need intercept it to check whether this is the authenticated user making that request to prevent unauthorised access.

So we use the authMiddleware.

step 1: Firstly for any new user we set their identity to null, [not necessary, only if we need additional info other that userId, which we store in session]

```
const authMiddleware = async (req, res, next) => {
  req.identity = {
    isAuthenticated: false,
    user: null,
  };
};
```

`req.identity` will add another property named identity to the request object, the identity itself is an object which stores the user details and whether authenticated or not.

step 2: Check to which route is the incoming request [since we cannot set userId for user's NOT logged in/registered]

```
if (req.url == "/login" || req.url == "/register") {
    return next(); - redirect accountsRoutes - so the user will login and then we'll set the session id
  }
```

step 3: Logged in users will have their userId in session, take it and store it to userId.

```
let userId = req.session.userId;
  if (!userId || userId == null) {
    return res.redirect("/login");
  }
```

step 4: Double checking that particular user still exists in our id;

```
let userFromDb = await Users.findByPk(userId);
  if (userFromDb == null) {
    return res.redirect("/login");
  }
```

step 5: Take those user Details and store it to the identity object we created and set isAuthenticated to true

```
req.identity.isAuthenticated = true;
  req.identity.user = {
    id: userFromDb.dataValues.id,
    fullname: userFromDb.dataValues.fullname,
    email: userFromDb.dataValues.email,
    role: "user",
  };
```

step 6: use `next()` to direct users to the next middleware ie they can access other pages.

From now on for authenticated client the req they sent contain the userId in session and user info in identity, so when they sent a new request to a different page, this authMiddleware intercepts it and checks if authenticated or not.

If authenticated, the req already contains the identity object, so it skips step 1, [they shouldn't be allowed to visit the url's in step 2, will fix it later], then in step 3, their userId is taken from the req.session and verified. Since authenticated step 4 is satisfied and step 5 will already exist so it's skiped and goes to step 6 which will send the client to the requested page.

In this requested page controller log req.session and req.identity to see the userId and userDetails stored in the req header.

check [code](https://github.com/emmanuelkiranr/express-app/blob/main/middlewares/authMiddleware.js)

[Instead of writing the authMiddleware we can use a package called passport]

## Authentication vs Authorization

Why users should login?

- authentication - to know who is the user

What the user is allowed to do?

- authorization - restrict or grant access to info depending on privileges a user has

To make sure pages that require previlege can only be accessed by loggedin user, ie "/create", "/update", "/delete" and all should be accessable only to logged in user, for other users they should be taken/redirected to the login/register page.

This is implemented in the authMiddleware, where we redirect users without userId to the login page.

Another method is to directly implement it in the routes by adding another middleware.

```
router.get("/", (req, res, next) => {
  if(req.session.userId) {
    next();
  } else {
    return res.status(401).end();
  }
}, (req, res) => {
  Movie.findAll().then((data) => {
    res.render("index", { data, identity: req.identity.user });
  });
};);
```

This way of chaining middleware to enforce rules that need to apply before we call the next middleware.

Also we need to deny logged in users from trying to access the "/login" and "/register" page and redirect them to their home/dashboard

So we create a function

```
const redirectIfLoggedIn = (req, res, next) => {
  if(req.session.userId) {
    return res.redirect("/")
  } else {
    return next();
  }
}
```

Then add this function to the login and register routes

```
router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login");
});
```

Only if user not logged in he's taken to the login page using next(); else he's redirected to home page "/".

Or we can directly implement this in the `authMiddleware`

```
let userId = req.session.userId;
  if (!userId || userId == null) {
    return res.redirect("/login");
  }

  if (req.url == "/login" || req.url == "/register") {
    return res.redirect("/");
  }
```

since for every req we check userId from session, when logged in user try to access login page they are redirected to home page.
