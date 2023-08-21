import User from "../../database/model/User";
import query from "../../database";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../../config";

function register(req, res) {
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    email: email,
    password: hashedPassword,
  })
    .then(function (data) {
      console.log(data);
      res
        .status(200)
        .json({ message: "a user registered!", data: data.dataValues });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({ message: "an error occured!", data: error });
    });
}
async function login(req, res) {
  const { identifier, password } = req.body;
  const user = await User.findOne({
    attributes: ["username", "password", "id"],
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  });
  if (!user) {
    res.status(400).json({ message: "Wrong credentials input!" });
  }
  const generateAccessToken = (userData) => {
    return jwt.sign(userData, config.jwtSecretToken);
  };
  // compare hashed password
  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      const token = generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      const { password, ...userDataWithoutPassword } = user.get();
      const serverRes = {
        message: "Login successful!",
        data: userDataWithoutPassword,
        jwt: token,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login unsuccessful",
        error: "Invalid credentials",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

function logout(req, res) {
  res.status(200).json({ message: "logout successful!" });
}

const authController = { register, login, logout };

export default authController;
