import Movie from "../models/models.js";

const index = (req, res) => {
  res.render("index");
};
const create = (req, res) => {
  res.render("movie-form");
};

const createPost = (req, res) => {
  console.log(req.body); // use body parser to values from the query to the req.body
  Movie.create({
    name: req.body.name,
    releaseDate: req.body.releasedate,
    summary: req.body.summary,
    director: req.body.director,
  }).then(() => {
    res.redirect("/");
  });
};

const update = (req, res) => {
  console.log(req.params);
  Movie.findByPk(req.params.id).then((movieDb) => {
    res.render("update", { data: movieDb });
  });
};

const updatePost = (req, res) => {
  Movie.update(
    {
      name: req.body.name,
      date: req.body.releasedate,
      summary: req.body.summary,
      director: req.body.director,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.redirect("/");
};

const _delete = async (req, res) => {
  let id = req.params.id;
  let exists = await Movie.findByPk(id);
  // Since this returns a promise, this is an async function,
  // so we have to finish executing this first inorder to delete the data only after verifying.
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
  // res.redirect("/");
};

export default { index, create, createPost, update, updatePost, _delete };
