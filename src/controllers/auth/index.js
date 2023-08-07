import User from "../../database/model/User";

function register(req, res) {
  const { username, email, password } = req.body;
  User.create({ username, email, password })
    .then(function (data) {
      console.log(data);
      res
        .status(200)
        .json({ message: "a user registered!", data: data.dataValues });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ message: "an error occured!", data: error });
    });
}
function login(req, res) {
  res.status(200).json({ message: "login" });
}
function logout(req, res) {
  res.status(200).json({ message: "logout" });
}

const authController = { register, login, logout };

export default authController;
