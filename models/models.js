import sequelize from "./db_handler.js";
import { DataTypes } from "sequelize";

const Movie = sequelize.define("Movie", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  director: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  fullname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export { Movie, Users };
