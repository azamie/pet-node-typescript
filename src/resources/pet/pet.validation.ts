import Joi from 'joi';

const create = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  imgURL: Joi.string().required(),
});

const update = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  imgURL: Joi.string().required(),
});
export default { create, update };
