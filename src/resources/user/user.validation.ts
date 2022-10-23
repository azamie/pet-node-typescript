import Joi from 'joi';

const register = Joi.object({
  username: Joi.string().required(),
  password: Joi.string(),
  role: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string(),
});

export default { register, login };
