import { Users } from "../models/models.js";
const authMiddleware = async (req, res, next) => {
  req.identity = {
    isAuthenticated: false,
    user: null,
  };

  // only logged in users have session id so make sure the user is logged in
  if (req.url == "/login" || req.url == "/register") {
    return next(); // redirect to the next middleware ie accountsRoutes - so the user will login and then we'll set the session id
  }

  // if logged in the we'll set the userId to the id from the user table and adding it to the session object we created using cookie-session
  let userId = req.session.userId; // take the userId from session object and store in a variable
  if (!userId || userId == null) {
    return res.redirect("/login");
  } // if there is no userId, it means user haven't logged in

  // else store the details of logged in user to req.identity
  let userFromDb = await Users.findByPk(userId);
  // if user doesn't ask to login
  if (userFromDb == null) {
    return res.redirect("/login");
  }
  // store details
  req.identity.isAuthenticated = true;
  req.identity.user = {
    id: userFromDb.dataValues.id,
    fullname: userFromDb.dataValues.fullname,
    email: userFromDb.dataValues.email,
    role: "user",
  };
  next(); // move to the next middleware ie movieRoutes
};

export default authMiddleware;
