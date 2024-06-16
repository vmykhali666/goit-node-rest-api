import Joi from "joi";

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

export const createContactSchema = contactSchema;

export const updateContactSchema = contactSchema.keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
});
