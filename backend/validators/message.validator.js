import { Joi, validate } from "express-validation";

export const sendMessageValidator = validate({
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .required().messages({
                 "any.required": "User id is required",
                 "string.pattern.base": "User id must be a valid MongoDB ID",
            }), 
    }),
    body: Joi.object({
        message: Joi.string().required().messages({
            "any.required": "Message is required",
            "string.message": "Message must be a string",
        }),
    })
})

export const getMessagesValidator = validate({
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .required().messages({
                "any.required": "User id is required",
                "string.pattern.base": "User id must be a valid MongoDB ID",
            }), 
    })
})