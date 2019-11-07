const joi = require("@hapi/joi");
module.exports = joi.object({
  castId: joi.number().required(),
  userName: joi
    .string()
    .alphanum()
    .max(50)
    .min(3)
    .required(),
  name: joi
    .string()
    .alphanum()
    .max(50)
    .min(3)
    .required(),
  surname: joi
    .string()
    .alphanum()
    .max(50)
    .min(3)
    .required(),
  department: joi
    .string()
    .pattern(/^[a-z\d\-_&\s]+$/i)
    .max(50)
    .min(3)
    .required(),
  email: joi.string().email(),
  role: joi
    .object({
      name: joi.string().required(),
      exceptions: joi.object()
    })
    .required(),
  groups: joi
    .array()
    .items(
      joi
        .string()
        .pattern(/^[a-z\d\-_&\s]+$/i)
        .required()
    )
    .required(),
  manager: joi
    .string()
    .alphanum()
    .max(50)
    .min(3)
    .required(),
  status: joi
    .string()
    .alphanum()
    .max(20)
    .min(2)
    .required()
});
