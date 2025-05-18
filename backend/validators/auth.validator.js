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
        }),
        email: Joi.string().email().required().messages({
            "any.required": "email is required",
            "string.email": "email must be a valid email address",
        }),
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

export const verifyEmailOTPValidator = validate({
    body: Joi.object({
        otp: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
            "any.required": "OTP is required",
            "string.otp": "OTP must be a string",
            "string.pattern.base": "OTP must be a 6 digit number",
            "string.empty": "OTP is required",
        })
    }),
});

export const sendResetPasswordOtpValidator = validate({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "any.required": "Email is required",
            "string.email": "Email must be a valid email address",
        }),
    }),
});

export const resetPasswordValidator = validate({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "any.required": "Email is required",
            "string.email": "Email must be a valid email address",
        }),
        newPassword: Joi.string().min(6).max(100).required().messages({
            "any.required": "New Password is required",
            "string.password": "New Password must be a string",
            "string.min": "New Password must be at least 6 characters",
            "string.max": "New Password must be less than 100 characters",
        }),
        otp: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
            "any.required": "OTP is required",
            "string.otp": "OTP must be a string",
            "string.pattern.base": "OTP must be a 6 digit number",
            "string.empty": "OTP is required",
        })
    })
})