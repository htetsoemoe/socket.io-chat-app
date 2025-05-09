import { Joi, validate } from "express-validation";

export const signupValidator = validate({
    body: Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Name is required",
            "string.name": "Name must be a string",
        }),
        username: Joi.string().max(20).required().messages({
            "any.required": "Username is required",
            "string.username": "Username must be a string",
            "string.max": "Username must be less than 20 characters",
        }),
        password: Joi.string().min(6).max(100).required().messages({
            "any.required": "Password is required",
            "string.password": "Password must be a string",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password must be less than 100 characters",
        }),
        confirmPassword: Joi.string().min(6).max(100).required().messages({
            "any.required": "Confirm password is required",
            "string.confirmPassword": "Confirm password must be a string",
            "string.min": "Confirm password must be at least 6 characters",
            "string.max": "Confirm password must be less than 100 characters",
        }),
        gender: Joi.string().valid("male", "female").required().messages({
            "any.required": "Gender is required",
            "string.gender": "Gender must be a string",
            "any.only": "Gender must be either male or female",
        })
    }),
});

export const signinValidator = validate({
    body: Joi.object({
        username: Joi.string().required().messages({
            "any.required": "Username is required",
            "string.username": "Username must be a string",
        }),
        password: Joi.string().min(6).max(100).required().messages({
            "any.required": "Password is required",
            "string.password": "Password must be a string",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password must be less than 100 characters",
        }),
    }),
})