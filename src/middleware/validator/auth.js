import { body } from "express-validator";
import User from "../../database/model/User";
import { Op, or } from "sequelize";

export const loginValidator = [
  //check email format
  body("identifier")
    .exists()
    .withMessage("Box cannot be blank")
    .custom(async function (value) {
      const user = await User.findOne({
        attributes: ["username", "email"],
        where: {
          [Op.or]: [{ username: value }, { email: value }],
        },
      });
      if (!user) {
        throw new Error("Wrong credentials input!");
      }
    }),
];
