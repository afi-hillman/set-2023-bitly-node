import { body } from "express-validator";

export const createLinkValidator = [
  body("link")
    .exists()
    .withMessage("link is required")
    .bail()
    .isURL()
    .withMessage("link is invalid"),
];

// export const updateLinkValidtor = [
//     body("link").exists().withMessage
// ]
