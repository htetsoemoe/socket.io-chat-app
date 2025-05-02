import { Joi, validate } from 'express-validation';

export const sendHeartValidator = validate({
    params: Joi.object({
        msgId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .required().messages({
                "any.required": "Message id is required",
                "string.pattern.base": "Message id must be a valid MongoDB ID",
            }),
    }),
    body: Joi.object({
        isLike: Joi.boolean().required().messages({
            "any.required": "isLike is required",
            "boolean.base": "isLike must be a boolean",
        }),
        senderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .required().messages({
                "any.required": "Sender id is required",
                "string.pattern.base": "Sender id must be a valid MongoDB ID",
            }),
        receiverId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .required().messages({
                "any.required": "Receiver id is required",
                "string.pattern.base": "Receiver id must be a valid MongoDB ID",
            }),
    })
})