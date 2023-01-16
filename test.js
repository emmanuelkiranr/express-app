import express from "express";

const app = express();

app.listen(3000);

// Built in middleware using json and urlencoded
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // extended: true gives us json like experience

// app.post("/item", (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
//   // json - { name: 'Cycle', quantity: '5' }
// });

app
  .route("/path")
  .get((req, res) => {
    // res.send("Read class info");
    throw new Error();
  })
  .post((req, res) => {
    res.send("Create class info");
  })
  .put((req, res) => {
    res.send("Update class info");
  })
  .delete((req, res) => {
    res.send("Delete class info");
  });
// route chaining

// multiple callback
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server Error");
});
