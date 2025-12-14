import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';

export const app = express();
config();
import pool from './config/db.js';
import { errorMiddleWare } from './middlewares/errorHandler.js';
import userRoute from './routes/userRoutes.js';
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productsRoutes.js';

app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CONNECT DATABASE
app.get('/', async (req, res) => {
	const result = await pool.query('SELECT current_database()');
	res.send(`The databse name is: ${result.rows[0].current_database}`);
});

// call route
app.use('/api/v1/user', userRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

app.use(errorMiddleWare);
