import { Users } from "../models/models.js";

const login = (req, res) => {
  console.log(req);
  res.render("login");
};

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
  res.redirect("/");
};

const register = (req, res) => {
  res.render("register");
};

const registerPost = async (req, res) => {
  const { fullname, email, password } = req.body;
  let exists = await Users.findOne({
    where: {
      email,
    },
  });
  if (exists == null) {
    await Users.create({
      fullname,
      email,
      password,
    });
    res.redirect("/login");
  } else {
    return res.render("register", { message: "user already exists" });
  }
};

export default { login, loginPost, register, registerPost };
