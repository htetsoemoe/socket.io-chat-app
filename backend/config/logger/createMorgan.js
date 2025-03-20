import morgan from 'morgan';
import moment from 'moment-timezone';

export default ({ logger }) => {
    morgan.token('date', (req, res, tz) => moment().tz(tz).format())
    morgan.format('myFormat', '":method :url" :status :res[content-length] - :response-time ms')

    return morgan('myFormat', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
}
