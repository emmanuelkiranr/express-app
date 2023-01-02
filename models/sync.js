import { Movie, Users } from "./models.js";

Movie.sync({ alter: true });
Users.sync({ alter: true });
