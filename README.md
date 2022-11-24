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
