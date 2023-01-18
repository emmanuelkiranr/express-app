import { Users } from "../models/models.js";
const authMiddleware = async (req, res, next) => {
  req.identity = {
    isAuthenticated: false,
    user: null,
  };

  let userId = req.session.userId; // userId taken from req.session object
  if (!userId || userId == null) {
    return res.redirect("/login");
  } // if there is no userId, it means user haven't logged in

  if (req.url == "/login" || req.url == "/register") {
    return res.redirect("/"); // logged in user don't need to access login or register page again
  }

  // else store the details of logged in user to req.identity
  let userFromDb = await Users.findByPk(userId);

  if (userFromDb == null) {
    return res.redirect("/login");
  }

  req.identity.isAuthenticated = true;
  req.identity.user = {
    id: userFromDb.dataValues.id,
    fullname: userFromDb.dataValues.fullname,
    email: userFromDb.dataValues.email,
    role: "user",
  };
  next(); // movieRoutes
};

export default authMiddleware;
