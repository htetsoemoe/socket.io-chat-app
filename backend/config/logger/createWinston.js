import winston from "winston";
import moment from 'moment-timezone';

let level = process.env.LOG_LEVEL || 'debug';
const { combine, label, printf } = winston.format;
const myFormat = printf((info) => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);
const appendTimestamp = winston.format((info, opts) => {
    const newInfo = { ...info };
    if (opts.tz) {
        newInfo.timestamp = moment().tz(opts.tz).format();
    }
    return newInfo;
});

const format = combine(
    label({ label: 'main' }),
    appendTimestamp({ tz: 'Asia/Yangon' }),
    myFormat,
);

// winston log level: [debug, info, notice, warning, error, crit, alert, emerg]
if (process.env.NODE_ENV === 'test') {
    level = 'debug';
}

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level,
    format,
    transports: [
        new winston.transports.Console({ format }),
    ],
});

export default logger;