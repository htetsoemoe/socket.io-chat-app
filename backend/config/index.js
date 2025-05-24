import logger from "./logger/createWinston.js";
import morgan from "./logger/createMorgan.js";
import transporter from "./nodemailer/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates/emailTemplates.js";

export { 
    logger, 
    morgan, 
    transporter, 
    EMAIL_VERIFY_TEMPLATE, 
    PASSWORD_RESET_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
 };