import  express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import connectDB from './db/connectDB.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/v1/auth', authRouter);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
}); 
